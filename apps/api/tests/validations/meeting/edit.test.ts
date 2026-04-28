import z from 'zod';
import { Expect, Equal } from 'src/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/edit';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > Edit', () => {
    it('validate output type', () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeetingController['IEdit']['IOutput'], IOutput>>;
    });

    it('validate input type', () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IEdit']['IInput'], IInput>>;
    });
});
