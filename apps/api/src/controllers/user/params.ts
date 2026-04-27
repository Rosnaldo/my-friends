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

interface ICriacao {
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
    email: IUser['IParams']['email'];
    role: IUser['IParams']['role'];
}

interface IByEmail {
    email: IUser['IParams']['email'];
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
}

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
    ICriacao: ICriacao;
    IByEmail: IByEmail;
    IDelete: IDelete;
    IEdit: IEdit;
    ICount: {
        IOutput: ICountOutput
    };
}
