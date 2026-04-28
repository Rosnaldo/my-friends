import z from 'zod';
import { Expect, Equal } from 'src/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/upload-gallery';
import { IMeetingController } from 'src/controllers/meeting/params';

describe('Validations > Meeting > UploadGallery', () => {
    it('validate output type', () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeetingController['IUploadGallery']['IOutput'], IOutput>>;
    });

    it('validate input type', () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IUploadGallery']['IInput'], IInput>>;
    });
});
