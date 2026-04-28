import { Request } from 'express';

import { logError } from '#utils/log_error';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { BadRequestException } from '#exceptions/bad_request';
import { MeetingBuilder } from '#schemas/meeting/utils';
import { mapString } from '#utils/mapper/string';
import { validateInput } from 'src/validations/meetings/create';

type IInput = IMeetingController['ICreate']['IInput'];
type IOutput = IMeetingController['ICreate']['IOutput'];

type Mapped = IInput;

interface Props {
    mapped: Mapped;
}

export class Create {
    public static readonly classId = Symbol.for('Controller > Meeting > Create');

    private constructor() {}

    static construir(classId: symbol): Create {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Create();
    }

    public readonly exec = async (props: Props): Promise<Either<IOutput>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { name } = params;

            const builder = new MeetingBuilder();
            const meeting = await builder.create({ name, isActive: false }).save();
            return successData(meeting);
        } catch (error: unknown) {
            return logError(error, '/meetings/create');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const { name } = body;

        return {
            name: mapString(name),
        };
    };

    public readonly transform = (mapped: Mapped): IInput => {
        const zodResult = validateInput(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IInput;
    };
}
