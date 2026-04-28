import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { UserUtils } from "#schemas/user/utils";
import { makeObjectIdSchema } from "src/utils/zod/valid_objectid_schema";
import { makeSmallStringSchema } from "src/utils/zod/valid_small_string";
import { makeEnumSchema } from "src/utils/zod/valid_enum";
import { ParticipantStatusAll } from "@repo/shared-types";
import { IUserController } from "src/controllers/user/params";

const utils = new UserUtils();

type IInput = IUserController['IParticipants']['IInput'];

export const inputSchema = z.object({
    meetingId: makeObjectIdSchema('meetingId').optional(),
    slug: makeSmallStringSchema('slug').optional(),
});

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

type IOutput = IUserController['IParticipants']['IOutput'];

export const outputSchema = z.array(
    utils.zodSchema.extend({
        status: makeEnumSchema(ParticipantStatusAll, 'status'),
    })
);

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
