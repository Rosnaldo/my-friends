import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { IUserController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { UserBuilder, UserUtils } from '#schemas/user/utils';
import { mapString } from '#utils/mapper/string';
import { getKcMain } from '#keycloak/singleton';

type IInput = IUserController['ICriacao']['IInput'];
type IOutput = IUserController['ICriacao']['IOutput'];

type Mapped = Omit<IInput, 'role'> & {
    role?: string;
};

interface Props {
    mapped: Mapped;
}

export class Criacao {
    public static readonly classId = Symbol.for('Controller > User > Criacao');
    private readonly utils: UserUtils;

    private constructor() {
        this.utils = new UserUtils();
    }

    static construir(classId: symbol): Criacao {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Criacao();
    }

    public readonly exec = async (props: Props): Promise<Either<IOutput>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const builder = new UserBuilder();
            const user = await builder.build(params).save();

            const kcMain = getKcMain();
            const client = await kcMain.getKcClientCredentials();
            await client.users.create({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            });
            return successData(user);
        } catch (error: unknown) {
            return logError(error, '/api/users/create');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const partial = this.utils.zodSchema.pick({
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        }).partial();

        const schema = z.object({
            ...partial.shape,
        });

        return schema;
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            firstName,
            lastName,
            email,
            role,
        } = body;

        return {
            firstName: mapString(firstName),
            lastName: mapString(lastName),
            email: mapString(email),
            role: mapString(role),
        };
    };

    private readonly validate = (mapped: Mapped): ValidateParseResult => {
        const schema = this.makeZodSchema();

        return validateParse<Mapped>(schema, mapped);
    };

    public readonly transform = (mapped: Mapped): IInput => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IInput;
    };
}
