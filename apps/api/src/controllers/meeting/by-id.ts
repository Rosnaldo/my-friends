import { Request } from 'express';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { mapString } from '#utils/mapper/string';
import { validateInput } from 'src/validations/meetings/by-id';
import { BadRequestException } from 'src/exceptions/bad_request';

type IInput = IMeetingController['IById']['IInput'];
type IOutput = IMeetingController['IById']['IOutput'];
type Mapped = IInput;

interface Props {
    mapped: Mapped;
}

export class ById {
    public static readonly classId = Symbol.for('Controller > Meeting > ById');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): ById {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new ById();
    }

    public readonly get = async (props: Props): Promise<Either<IOutput>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id } = params;

            const metting = await this.crud.findOne({ _id });
            return successData(metting);
        } catch (error: unknown) {
            return logError(error, '/meetings/by-id');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            _id,
        } = body;

        return {
            _id: mapString(_id),
        };
    };

    public readonly transform = (mapped: Mapped): IInput => {
        const zodResult = validateInput(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IInput;
    };
}
