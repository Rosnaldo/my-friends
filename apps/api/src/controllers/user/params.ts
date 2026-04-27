import { IUser } from "#schemas/user/types";
import { PaginateResponse } from "src/types";

interface IParticipants {
    meetingId?: string;
    slug?: string;
}

interface IPaginacaoInput {
    search?: string;
    page: number;
    pageSize: number;
    isPagination?: boolean;
}

type IPaginacaoOutput = PaginateResponse<IUser['IParams']>;

interface ICriacaoInput {
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
    email: IUser['IParams']['email'];
    role: IUser['IParams']['role'];
}

type ICriacaoOutput = IUser['IParams'];

interface IByEmailInput {
    email: NonNullable<IUser['IParams']['email']>;
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
}

type IByEmailOutput = IUser['IParams'];

interface IDelete {
    _id: IUser['IParams']['_id'];
}

interface IEdit {
    _id: IUser['IParams']['_id'];
    firstName?: IUser['IParams']['firstName'];
    lastName?: IUser['IParams']['lastName'];
    email?: IUser['IParams']['email'];
    role?: IUser['IParams']['role'];
}

interface ICountOutput {
    members: number;
    admins: number;
}

export interface IUserController {
    IParticipants: IParticipants;
    IPaginacao: {
        IInput: IPaginacaoInput;
        IOutput: IPaginacaoOutput;
    };
    ICriacao: {
        IInput: ICriacaoInput;
        IOutput: ICriacaoOutput;
    };
    IByEmail: {
        IInput: IByEmailInput;
        IOutput: IByEmailOutput;
    };
    IDelete: IDelete;
    IEdit: IEdit;
    ICount: {
        IOutput: ICountOutput
    };
}
