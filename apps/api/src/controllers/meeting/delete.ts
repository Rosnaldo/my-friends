import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { mapString } from '#utils/mapper/string';

type IDelete = IMeetingController['IDelete']['IInput'];

interface Props {
    mapped: IDelete;
}

export class Delete {
    public static readonly classId = Symbol.for('Controller > Meeting > Delete');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): Delete {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Delete();
    }

    public readonly exec = async (props: Props): Promise<Either<string>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id } = params;

            await this.crud.delete(_id);
            return successData('success');
        } catch (error: unknown) {
            return logError(error, '/meetings/delete');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const schema = z.object({
            _id: makeObjectIdSchema('_id'),
        });

        return schema;
    };

    public readonly mapper = (body: Request['body']): IDelete => {
        const {
            _id,
        } = body;

        return {
            _id: mapString(_id),
        };
    };

    private readonly validate = (mapped: IDelete): ValidateParseResult => {
        const schema = this.makeZodSchema();

        return validateParse<IDelete>(schema, mapped);
    };

    public readonly transform = (mapped: IDelete): IDelete => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IDelete;
    };
}
