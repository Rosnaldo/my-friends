import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { MeetingUtils } from "#schemas/meeting/utils";
import { makeNumberSchema } from "src/utils/zod/valid_number";
import { makeSmallStringSchema } from "src/utils/zod/valid_small_string";
import { makeBooleanSchema } from "src/utils/zod/valid_boolean";
import { IMeetingController } from "src/controllers/meeting/params";

const utils = new MeetingUtils();

type IInput = IMeetingController['IPaginacao']['IInput'];

export const inputSchema = z.object({
    page: makeNumberSchema('page'),
    pageSize: makeNumberSchema('pageSize'),
});

export const validateInput = (params: IInput): ValidateParseResult => {
    return validateParse<IInput>(inputSchema, params);
};

type IOutput = IMeetingController['IPaginacao']['IOutput'];

export const outputSchema = z.object({
    data: z.array(utils.zodSchema),
    status: makeNumberSchema('status'),
    message: makeSmallStringSchema('message'),
    isError: makeBooleanSchema('isError'),
    pagination: z.object({
        currentPage: makeNumberSchema('currentPage'),
        totalPages: makeNumberSchema('totalPages'),
        totalRecords: makeNumberSchema('totalRecords'),
        size: makeNumberSchema('size'),
    }),
});

export const validateOutput = (params: IOutput): ValidateParseResult => {
    return validateParse<IOutput>(outputSchema, params);
};
