import { Expect, Equal } from 'src/types';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import { outputSchema, inputSchema } from 'src/validations/meetings/by-slug';
import z from 'zod';
import { IMeetingController } from 'src/controllers/meeting/params';


describe('Validations > Meeting > BySlug', () => {
    it('validate output type ', async () => {
        type IOutput = z.infer<typeof outputSchema>;
        type _t = Expect<Equal<IMeeting['IParams'], IOutput>>
    });

    it('validate input type ', async () => {
        type IInput = z.infer<typeof inputSchema>;
        type _t = Expect<Equal<IMeetingController['IBySlug'], IInput>>
    });
});
