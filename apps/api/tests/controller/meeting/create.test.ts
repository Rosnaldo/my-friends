import Chance from 'chance';

import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { validateOutput } from 'src/validations/meetings/create';
import { MeetingController } from 'src/controllers/meeting';
import { isSuccess } from 'src/utils/either';

const chance = new Chance();

beforeAll(async () => {
    await mongooseBootstrap();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > Create', () => {
    it('persists the meeting in the database with the correct fields', async () => {
        const body = {
            name: chance.name(),
        };

        const controller = new MeetingController();
        const mapped = controller.create.mapper(body);
        const either = await controller.create.exec({ mapped });

        if (!isSuccess(either)) throw new Error('Should not return error');

        expect(either.data.name).toBe(body.name);
        expect(either.data.isActive).toBe(false);

        const zodResult = validateOutput(either.data);
        expect(zodResult.hasError).toBeFalsy();
    });
});
