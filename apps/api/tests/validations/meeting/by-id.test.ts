import z from 'zod';
import { Expect, Equal } from 'src/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/by-id';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > ById', () => {
    it('validate output type ', async () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeetingController['IById']['IOutput'], IOutput>>
    });

    it('validate input type ', async () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IById']['IInput'], IInput>>
    });
});
