import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { MeetingUtils } from "#schemas/meeting/utils";
import { IMeeting } from "src/entities/schemas/meeting/types";
import { makeSmallStringSchema } from "src/utils/zod/valid_small_string";

const utils = new MeetingUtils();

type IInput = { slug: string };

export const inputSchema = z.object({
  slug: makeSmallStringSchema('slug'),
});

export const validateInput = (params: IInput): ValidateParseResult => {
  return validateParse<IInput>(inputSchema, params);
};

type IOutput = IMeeting['IParams'];

export const outputSchema = utils.zodSchema;

export const validateOutput = (params: IOutput): ValidateParseResult => {
  return validateParse<IOutput>(outputSchema, params);
};
