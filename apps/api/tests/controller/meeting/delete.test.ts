import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';
import { getMeetingModel } from 'src/entities/models/singleton';

beforeAll(async () => {
    await mongooseBootstrap();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > Delete', () => {
    it('deletes meeting from the database', async () => {
        const meeting = await mockMeeting({
            init: { isActive: false },
            participants: [],
            days: [],
            gallery: [],
        }).save();

        const body = { _id: meeting._id };
        const controller = new MeetingController();
        const mapped = controller.delete.mapper(body);
        const either = await controller.delete.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        const deleted = await getMeetingModel().findById(meeting._id).lean();

        expect(deleted).toBeNull();
    });
});
