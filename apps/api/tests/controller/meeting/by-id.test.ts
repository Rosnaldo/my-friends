import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import { validateOutput } from 'src/validations/meetings/by-id';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';

let meeting: IMeeting['IParams'];

beforeAll(async () => {
    await mongooseBootstrap();
    const builder = mockMeeting({
        init: {},
        participants: [],
        days: [],
        gallery: [],
    });
    meeting = await builder.save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > ById', () => {
    it('validate output', async () => {
        const params = {
            _id: meeting._id.toString(),
        };

        const controller = new MeetingController();

        const mapped = controller.byId.mapper(params);
        const either = await controller.byId.get({ mapped });

        if (isSuccess(either)) {
            const zodResult = validateOutput(either.data);
            expect(zodResult.hasError).toBeFalsy();
        } else {
            throw new Error('Should not throw error');
        }
    });
});
