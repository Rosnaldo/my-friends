import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { MeetingUtils } from "#schemas/meeting/utils";
import { makeObjectIdSchema } from "src/utils/zod/valid_objectid_schema";
import { IMeetingController } from "src/controllers/meeting/params";

const utils = new MeetingUtils();

type IInput = IMeetingController['IUploadGallery']['IInput'];

export const inputSchema = z.object({
    meetingId: makeObjectIdSchema('meetingId'),
    ...utils.zodPictureSchema.pick({ w: true, h: true }).shape,
});

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

type IOutput = IMeetingController['IUploadGallery']['IOutput'];

export const outputSchema = utils.zodSchema;

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
