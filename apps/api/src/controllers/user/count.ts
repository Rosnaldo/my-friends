import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { Either, successData } from '#utils/either';
import { UserRole } from '@repo/shared-types';
import { IUserController } from './params';

type IOutput = IUserController['ICount']['IOutput'];

export class Count {
    public readonly classId = Symbol.for('Controller > User > Count');
    private readonly crud: UserCrud;

    private constructor() {
        this.crud = new UserCrud();
    }

    static construir(classId: symbol): Count {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Count();
    }

    public readonly get = async (): Promise<Either<IOutput>> => {
        try {
            const admins = await this.crud.count({ role: UserRole.admin });
            const members = await this.crud.count({ role: UserRole.member });
            return successData({ admins, members });
        } catch (error: unknown) {
            return logError(error, '/users/count');
        }
    };
}
