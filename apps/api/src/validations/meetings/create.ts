import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { MeetingUtils } from "#schemas/meeting/utils";
import { makeSmallStringSchema } from "src/utils/zod/valid_small_string";
import { IMeetingController } from "src/controllers/meeting/params";

const utils = new MeetingUtils();

type IInput = IMeetingController['ICreate']['IInput'];

export const inputSchema = z.object({
    name: makeSmallStringSchema('name'),
});

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

type IOutput = IMeetingController['ICreate']['IOutput'];

export const outputSchema = utils.zodSchema;

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
