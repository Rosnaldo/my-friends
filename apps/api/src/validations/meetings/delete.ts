import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { makeObjectIdSchema } from "src/utils/zod/valid_objectid_schema";
import { IMeetingController } from "src/controllers/meeting/params";

type IInput = IMeetingController['IDelete']['IInput'];

export const inputSchema = z.object({
    _id: makeObjectIdSchema('_id'),
});

export const validateInput = (params: any): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};
