import z from 'zod';
import { Expect, Equal } from 'src/types';
import { inputSchema } from 'src/validations/meetings/delete';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > Delete', () => {
    it('validate input type', () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IDelete']['IInput'], IInput>>;
    });
});
