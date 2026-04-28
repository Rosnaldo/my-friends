import { mockUser } from '../../entities/schemas/user/mock';
import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { IUser } from 'src/entities/schemas/user/types';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import { validateOutput } from 'src/validations/user/participants';
import { UserController } from 'src/controllers/user';
import { ParticipantStatus } from '@repo/shared-types';
import 'src/extensions/transform_in_dict';
import { isSuccess } from 'src/utils/either_list';

let user: IUser['IParams'];
let meeting: IMeeting['IParams'];

jest.mock('src/keycloak/singleton', () => ({
    getKcMain: jest.fn().mockReturnValue({
        getKcClientCredentials: jest.fn().mockResolvedValue({
            users: {
                create: jest.fn().mockResolvedValue({}),
                find: jest.fn().mockResolvedValue([{ id: 'mock-kc-user-id' }]),
                del: jest.fn().mockResolvedValue(undefined),
                update: jest.fn().mockResolvedValue(undefined),
            },
        }),
    }),
    buildKcMain: jest.fn().mockResolvedValue({}),
}));

beforeAll(async () => {
    await mongooseBootstrap();
    user = await mockUser().save();
    meeting = await mockMeeting({
        init: { isActive: true },
        participants: [{ userId: user._id, status: ParticipantStatus.confirmed }],
        days: [],
        gallery: [],
    }).save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > User > Participants', () => {
    it('validate output by slug', async () => {
        const params = { slug: meeting.slug };

        const controller = new UserController();
        const mapped = controller.participants.mapper(params);
        const either = await controller.participants.get({ user, params: mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.length).toBeGreaterThanOrEqual(1);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });

    it('validate output by meetingId', async () => {
        const params = { meetingId: meeting._id };

        const controller = new UserController();
        const mapped = controller.participants.mapper(params);
        const either = await controller.participants.get({ user, params: mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.length).toBeGreaterThanOrEqual(1);
        expect(either.data[0].status).toBe(ParticipantStatus.confirmed);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });
});
