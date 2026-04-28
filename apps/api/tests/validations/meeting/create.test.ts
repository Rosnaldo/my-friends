import z from 'zod';
import { Expect, Equal } from 'src/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/create';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > Create', () => {
    it('validate output type', () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeetingController['ICreate']['IOutput'], IOutput>>;
    });

    it('validate input type', () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['ICreate']['IInput'], IInput>>;
    });
});
