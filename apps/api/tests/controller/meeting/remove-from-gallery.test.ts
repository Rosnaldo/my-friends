import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';
import { validateOutput } from 'src/validations/meetings/remove-from-gallery';

jest.mock('src/helpers/s3', () => ({
    uploadToS3: jest.fn().mockResolvedValue({}),
    deleteFromS3: jest.fn().mockResolvedValue({}),
}));

beforeAll(async () => {
    await mongooseBootstrap();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > RemoveFromGallery', () => {
    it('removes item from gallery', async () => {
        const s3Path = 'meetings/test/gallery/item.jpg';
        const meeting = await mockMeeting({
            init: { isActive: true },
            participants: [],
            days: [],
            gallery: [{ s3Path }],
        }).save();

        const body = { meetingId: meeting._id, s3Path };
        const controller = new MeetingController();
        const mapped = controller.removeFromGallery.mapper(body);
        const either = await controller.removeFromGallery.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.gallery).toHaveLength(0);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('returns error when meeting does not exist', async () => {
        const body = {
            meetingId: '000000000000000000000000',
            s3Path: 'meetings/test/gallery/item.jpg',
        };

        const controller = new MeetingController();
        const mapped = controller.removeFromGallery.mapper(body);
        const either = await controller.removeFromGallery.exec({ mapped });

        expect(either.isError).toBe(true);
    });
});
