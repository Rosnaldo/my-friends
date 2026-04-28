import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { validateOutput } from 'src/validations/meetings/paginacao';
import { MeetingController } from 'src/controllers/meeting';
import { PaginateResponse } from 'src/types';
import { IMeeting } from 'src/entities/schemas/meeting/types';

beforeAll(async () => {
    await mongooseBootstrap();
    await mockMeeting({ init: { isActive: true }, participants: [], days: [], gallery: [] }).save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > Paginacao', () => {
    it('validate output', async () => {
        const params = { page: 1, pageSize: 10 };

        const controller = new MeetingController();
        const mapped = controller.paginacao.mapper(params);
        const result = await controller.paginacao.get({ params: mapped });

        const paginated = result as PaginateResponse<IMeeting['IParams']>;
        if (paginated.isError) throw new Error('Should not return error');

        const zodResult = validateOutput(paginated);
        expect(zodResult.hasError).toBeFalsy();
    });
});
