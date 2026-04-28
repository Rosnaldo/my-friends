import _ from 'lodash';
import { logError } from '#utils/log_error';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { IMeeting } from '#schemas/meeting/types';
import { mapString } from '#utils/mapper/string';
import properties from '#properties';
import { BadRequestException } from '#exceptions/bad_request';
import { deleteFromS3 } from '#helpers/s3';
import { MeetingBuilder, MeetingUtils } from '#schemas/meeting/utils';
import { Request } from 'express';
import { getMeetingDao } from '#daos/singleton';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import z from 'zod';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';

type IRemoveFromGallery = IMeetingController['IRemoveFromGallery']['IInput'];
type Mapped = IRemoveFromGallery

interface Props {
    mapped: Mapped;
}

export class RemoveFromGallery {
    public static readonly classId = Symbol.for('Controller > Meeting > RemoveFromGallery');
    private readonly utils: MeetingUtils;

    private constructor() {
        this.utils = new MeetingUtils();
    }

    static construir(classId: symbol): RemoveFromGallery {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new RemoveFromGallery();
    }

    public readonly exec = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { meetingId, s3Path } = params;

            const meeting = await getMeetingDao().findOne({ _id: meetingId });
            if (_.isNil(meeting)) {
                throw new BadRequestException('Meeting não encontrado')
            }

            const bucket = properties.awsS3Bucket!;
            await deleteFromS3({
                Bucket: bucket,
                Key: s3Path,
            });

            meeting.gallery = meeting.gallery.filter((g) => g.s3Path !== s3Path);
            const builder = new MeetingBuilder(meeting);
            const updated = await builder.save();
            return successData(updated);
        } catch (error: unknown) {
            return logError(error, '/meeting/by-id');
        }
    };

    public readonly makeZodSchema = () => {
        const picture = this.utils.zodPictureSchema.pick({
            s3Path: true,
        });

        const schema = z.object({
            meetingId: makeObjectIdSchema('meetingId'),
            ...picture.shape,
        });

        return schema;
    }

    private readonly validate = (mapped: Mapped): ValidateParseResult => {
            const schema = this.makeZodSchema();
            return validateParse<Mapped>(schema, mapped);
        };
    
    public readonly transform = (mapped: Mapped): IRemoveFromGallery => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IRemoveFromGallery;
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            meetingId,
            s3Path,
        } = body;

        return {
            meetingId:  mapString(meetingId),
            s3Path:  mapString(s3Path),
        };
    };
}
