import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { MeetingUtils } from "#schemas/meeting/utils";
import { makeObjectIdSchema } from "src/utils/zod/valid_objectid_schema";
import { IMeetingController } from "src/controllers/meeting/params";

const utils = new MeetingUtils();

type IInput = IMeetingController['IEdit']['IInput'];

const daySchema = z.object({
    ...utils.zodDaySchema.pick({
        isodate: true,
        allDayLong: true,
    }).shape,
    ...utils.zodDaySchema.pick({ start: true, finish: true }).partial().shape,
});

const gallerySchema = z.object({
    ...utils.zodPictureSchema.pick({
        w: true, h: true, url: true, s3Path: true, type: true,
    }).shape,
});

const participantSchema = z.object({
    ...utils.zodParticipantSchema.pick({ userId: true, status: true }).shape,
});

const meetingFields = utils.zodSchema.pick({ name: true, slug: true, isActive: true });

export const inputSchema = z.object({
    _id: makeObjectIdSchema('_id'),
    ...meetingFields.shape,
    days: z.array(daySchema),
    gallery: z.array(gallerySchema),
    participants: z.array(participantSchema),
});

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

type IOutput = IMeetingController['IEdit']['IOutput'];

export const outputSchema = utils.zodSchema;

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
