import { Request } from 'express';

import { logError } from '#utils/log_error';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { BadRequestException } from '#exceptions/bad_request';
import { mapString } from '#utils/mapper/string';
import { toUndefined } from '#utils/mapper/to_undefined';
import { mapNumber } from '#utils/mapper/number';
import { mapBoolean } from '#utils/mapper/boolean';
import { validateInput } from 'src/validations/meetings/edit';
import { MeetingBuilder } from 'src/entities/schemas/meeting/utils';
import { getMeetingDao } from 'src/daos/singleton';
import _ from 'lodash';

type IInput = IMeetingController['IEdit']['IInput'];
type IOutput = IMeetingController['IEdit']['IOutput'];

type Mapped = IInput;

interface Props {
    mapped: Mapped;
}

export class Edit {
    public static readonly classId = Symbol.for('Controller > Meeting > Edit');

    private constructor() {}

    static construir(classId: symbol): Edit {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Edit();
    }

    public readonly exec = async (props: Props): Promise<Either<IOutput>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id, name, isActive, days, participants, gallery } = params;

            const meeting = await getMeetingDao().findById(_id);
            if (_.isNil(meeting)) {
                throw new BadRequestException('Meeting not found')
            }
            const builder = new MeetingBuilder(meeting);
            const updated = await builder
                .update({ name, isActive })
                .setGallery(gallery)
                .setParticipants(participants)
                .setDays(days)
                .save();
            
            return successData(updated);
        } catch (error: unknown) {
            return logError(error, '/meeting/edit');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            _id,
            name,
            slug,
            isActive,
            days,
            gallery,
            participants,
        } = body;

        return {
            _id: mapString(_id),
            days: (days || []).map((d: any) => ({
                ...(d.start ? { start: toUndefined('start', d.start) } : {}),
                ...(d.finish ? { finish: toUndefined('finish', d.finish) } : {}),
                isodate: new Date(d.isodate),
                allDayLong: mapBoolean({ v: d.allDayLong, defaultV: false }),
            })),
            gallery: (gallery || []).map((d: any) => ({
                s3Path: mapString(d.s3Path),
                type: mapString(d.type),
                url: mapString(d.url),
                w: mapNumber(d.w),
                h: mapNumber(d.h),
            })),
            participants: (participants || []).map((d: any) => ({
                userId: mapString(d.userId),
                status: mapString(d.status),
            })),
            name: mapString(name),
            slug: mapString(slug),
            isActive: mapBoolean({ v: isActive, defaultV: false }),
        };
    };

    public readonly transform = (mapped: Mapped): IInput => {
        const zodResult = validateInput(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IInput;
    };
}
