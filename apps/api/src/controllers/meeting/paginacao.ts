import { Request } from 'express';

import { getMeetingDao } from '#daos/singleton';

import { IMeeting } from '#schemas/meeting/types';
import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { EitherPaginacao, successData } from '#utils/either_paginacao';
import { mapNumber } from '#utils/mapper/number';

type IPaginacao = IMeetingController['IPaginacao']['IInput'];

interface Props {
    params: IPaginacao;
}

export class Paginacao {
    public readonly classId = Symbol.for('Controller > Meeting > Paginacao');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): Paginacao {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Paginacao();
    }

    public readonly get = async (props: Props): Promise<EitherPaginacao<IMeeting['IParams']>> => {
        try {
            const { params } = props;
            const { page, pageSize } = params;
            const query = {};
            const skip = (page - 1) * pageSize;
            const populate = {
                populate: [
                    { path: "participants" },
                ]
            };

            const list = await this.crud.find(query, {}, { limit: pageSize, skip, ...populate });
            const totalRecords = await getMeetingDao().count(query);

            return successData(list, {
                currentPage: page,
                totalPages: Math.ceil(totalRecords / pageSize),
                totalRecords,
                size: pageSize
            });
        } catch (error: unknown) {
            return logError(error, '/meetings/list');
        }
    };

    public readonly mapper = (body: Request['body']): IPaginacao => {
        const {
            page,
            pageSize,
        } = body;

        return {
            pageSize: mapNumber(pageSize, 10),
            page: mapNumber(page, 1),
        };
    };
}
