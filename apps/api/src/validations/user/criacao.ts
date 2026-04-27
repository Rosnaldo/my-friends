import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { IUserController } from "src/controllers/user/params";
import { makeEmailSchema } from "src/utils/zod/valid_email";
import { makeStringSchema } from "src/utils/zod/valid_small_string";
import { makeEnumSchema } from "src/utils/zod/valid_enum";
import { UserRoleAll } from "@repo/shared-types";
import { UserUtils } from "src/entities/schemas/user/utils";

type IOutput = IUserController['ICriacao']['IOutput'];
type IInput = IUserController['ICriacao']['IInput'];

const utils = new UserUtils();

export const inputSchema = utils.zodSchema;

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

export const outputSchema = z.object({
    email: makeEmailSchema(),
    firstName: makeStringSchema('firstName'),
    lastName: makeStringSchema('lastName'),
    role: makeEnumSchema(UserRoleAll, 'role'),
});

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
