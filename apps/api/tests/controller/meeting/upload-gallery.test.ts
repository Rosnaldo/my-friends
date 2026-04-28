import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';
import { validateOutput } from 'src/validations/meetings/upload-gallery';
import { PictureType } from '@repo/shared-types';

jest.mock('src/helpers/s3', () => ({
    uploadToS3: jest.fn().mockResolvedValue({}),
}));

jest.mock('src/utils/image/compress', () => ({
    compressToTargetSize: jest.fn().mockResolvedValue(Buffer.from('compressed')),
}));

let meeting: IMeeting['IParams'];

const fakeFile: Express.Multer.File = {
    buffer: Buffer.from('fake-image-data'),
    mimetype: 'image/jpeg',
    originalname: 'test.jpg',
    encoding: '7bit',
    fieldname: 'file',
    size: 14,
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
};

beforeAll(async () => {
    await mongooseBootstrap();
    meeting = await mockMeeting({
        init: { isActive: true },
        participants: [],
        days: [],
        gallery: [],
    }).save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > UploadGallery', () => {
    it('adds image to gallery', async () => {
        const body = { meetingId: meeting._id, w: 16, h: 9 };

        const controller = new MeetingController();
        const mapped = controller.uploadGallery.mapper(body);
        const either = await controller.uploadGallery.exec({ file: fakeFile, mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.gallery).toHaveLength(1);
        expect(either.data.gallery[0].type).toBe(PictureType.image);
        expect(either.data.gallery[0].w).toBe(body.w);
        expect(either.data.gallery[0].h).toBe(body.h);
        expect(either.data.gallery[0].s3Path).toMatch(/^meetings\//);
        expect(either.data.gallery[0].url).toBeDefined();

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('returns error when meeting does not exist', async () => {
        const body = { meetingId: '000000000000000000000000', w: 16, h: 9 };

        const controller = new MeetingController();
        const mapped = controller.uploadGallery.mapper(body);
        const either = await controller.uploadGallery.exec({ file: fakeFile, mapped });

        expect(either.isError).toBe(true);
    });
});
