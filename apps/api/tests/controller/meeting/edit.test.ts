import Chance from 'chance';
import { Types } from 'mongoose';

import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mockUser } from '../../entities/schemas/user/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import { IUser } from 'src/entities/schemas/user/types';
import { validateOutput } from 'src/validations/meetings/edit';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';
import { ParticipantStatus, Weekday, PictureType } from '@repo/shared-types';

const chance = new Chance();
let meeting: IMeeting['IParams'];
let user: IUser['IParams'];

const baseBody = () => ({
    _id: meeting._id,
    name: meeting.name,
    slug: meeting.slug,
    isActive: meeting.isActive,
    days: [],
    gallery: [],
    participants: [],
});

beforeAll(async () => {
    await mongooseBootstrap();
    user = await mockUser().save();
    meeting = await mockMeeting({
        init: { isActive: false },
        participants: [],
        days: [],
        gallery: [],
    }).save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > Edit', () => {
    it('updates name and isActive', async () => {
        const body = {
            ...baseBody(),
            name: chance.name(),
            isActive: true,
        };

        const controller = new MeetingController();
        const mapped = controller.edit.mapper(body);
        const either = await controller.edit.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.name).toBe(body.name);
        expect(either.data.isActive).toBe(true);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('saves days to the database', async () => {
        const isodate = new Date('2026-06-15');
        const day = {
            isodate,
            allDayLong: false,
            start: '09:00',
            finish: '18:00',
        };

        const body = { ...baseBody(), days: [day] };

        const controller = new MeetingController();
        const mapped = controller.edit.mapper(body);
        const either = await controller.edit.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.days).toHaveLength(1);
        expect(either.data.days[0].day).toBe(15);
        expect(either.data.days[0].month).toBe(6);
        expect(either.data.days[0].year).toBe(2026);
        expect(either.data.days[0].formatted).toBe('15/06/2026');
        expect(either.data.days[0].weekday).toBe('sunday');
        expect(either.data.days[0].allDayLong).toBe(day.allDayLong);
        expect(either.data.days[0].start).toBe(day.start);
        expect(either.data.days[0].finish).toBe(day.finish);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('saves gallery to the database', async () => {
        const galleryItem = {
            url: 'https://example.com/photo.jpg',
            s3Path: `meetings/test/${new Types.ObjectId()}.jpg`,
            type: PictureType.image,
            w: 16,
            h: 9,
        };

        const body = { ...baseBody(), gallery: [galleryItem] };

        const controller = new MeetingController();
        const mapped = controller.edit.mapper(body);
        const either = await controller.edit.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.gallery).toHaveLength(1);
        expect(either.data.gallery[0].url).toBe(galleryItem.url);
        expect(either.data.gallery[0].s3Path).toBe(galleryItem.s3Path);
        expect(either.data.gallery[0].type).toBe(galleryItem.type);
        expect(either.data.gallery[0].w).toBe(galleryItem.w);
        expect(either.data.gallery[0].h).toBe(galleryItem.h);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('saves participants to the database', async () => {
        const participant = {
            userId: user._id,
            status: ParticipantStatus.confirmed,
        };

        const body = { ...baseBody(), participants: [participant] };

        const controller = new MeetingController();
        const mapped = controller.edit.mapper(body);
        const either = await controller.edit.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.participants).toHaveLength(1);
        expect(either.data.participants[0].userId).toBe(participant.userId);
        expect(either.data.participants[0].status).toBe(participant.status);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });
});
