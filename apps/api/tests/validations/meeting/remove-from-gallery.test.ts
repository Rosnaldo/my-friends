import z from 'zod';
import { Expect, Equal } from 'src/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/remove-from-gallery';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > RemoveFromGallery', () => {
    it('validate output type', () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeetingController['IRemoveFromGallery']['IOutput'], IOutput>>;
    });

    it('validate input type', () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IRemoveFromGallery']['IInput'], IInput>>;
    });
});
