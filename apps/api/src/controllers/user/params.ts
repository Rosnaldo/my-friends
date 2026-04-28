import { IUser } from "#schemas/user/types";
import { IUserParticipant } from "@repo/shared-types";
import { PaginateResponse } from "src/types";

interface IParticipantsInput {
    meetingId?: string;
    slug?: string;
}

type IParticipantsOutput = Array<{ [K in keyof IUserParticipant]: IUserParticipant[K] }>;

interface IPaginacaoInput {
    search?: string;
    page: number;
    pageSize: number;
    isPagination?: boolean;
}

type IPaginacaoOutput = PaginateResponse<IUser['IParams']>;

interface ICreateInput {
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
    email?: IUser['IParams']['email'];
    role: IUser['IParams']['role'];
}

type ICreateOutput = IUser['IParams'];

interface IByEmailInput {
    email: NonNullable<IUser['IParams']['email']>;
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
}

type IByEmailOutput = IUser['IParams'];

interface IDeleteInput {
    _id: IUser['IParams']['_id'];
}

type IDeleteOutput = {};

interface IEditInput {
    _id: IUser['IParams']['_id'];
    firstName?: IUser['IParams']['firstName'];
    lastName?: IUser['IParams']['lastName'];
    email?: IUser['IParams']['email'];
    role?: IUser['IParams']['role'];
}

type IEditOutput = IUser['IParams'];

interface ICountOutput {
    members: number;
    admins: number;
}

export interface IUserController {
    IParticipants: {
        IInput: IParticipantsInput;
        IOutput: IParticipantsOutput;
    };
    IPaginacao: {
        IInput: IPaginacaoInput;
        IOutput: IPaginacaoOutput;
    };
    ICreate: {
        IInput: ICreateInput;
        IOutput: ICreateOutput;
    };
    IByEmail: {
        IInput: IByEmailInput;
        IOutput: IByEmailOutput;
    };
    IDelete: {
        IInput: IDeleteInput;
        IOutput: IDeleteOutput;
    };
    IEdit: {
        IInput: IEditInput;
        IOutput: IEditOutput;
    };
    ICount: {
        IOutput: ICountOutput
    };
}
