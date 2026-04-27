import { Request } from 'express';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { IMeeting } from '#schemas/meeting/types';
import { mapString } from '#utils/mapper/string';
import { validateInput } from 'src/validations/meetings/by-slug';
import { BadRequestException } from 'src/exceptions/bad_request';

type IBySlug = IMeetingController['IBySlug'];
type Mapped = IBySlug

interface Props {
    mapped: Mapped;
}

export class BySlug {
    public static readonly classId = Symbol.for('Controller > Meeting > BySlug');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): BySlug {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new BySlug();
    }

    public readonly get = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { slug } = params;

            const metting = await this.crud.findOne({ slug });
            return successData(metting);
        } catch (error: unknown) {
            return logError(error, '/meeting/by-slug');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            slug,
        } = body;

        return {
            slug: mapString(slug),
        };
    };

    public readonly transform = (mapped: Mapped): IBySlug => {
        const zodResult = validateInput(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IBySlug;
    };
}
