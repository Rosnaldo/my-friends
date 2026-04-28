import { IMeeting } from "#schemas/meeting/types";
import { IDay, IParticipant, IPicture } from "@repo/shared-types";
import { PaginateResponse } from "src/types";

interface IByIdInput {
    _id: string;
}

type IByIdOutput = IMeeting['IParams'];

interface IBySlugInput {
    slug: string;
}

type IBySlugOutput = IMeeting['IParams'];

interface IPaginacaoInput {
    page: number;
    pageSize: number;
}

type IPaginacaoOutput = PaginateResponse<IMeeting['IParams']>;

interface ICreateInput {
    name: IMeeting['IParams']['name'];
}

type ICreateOutput = IMeeting['IParams'];

interface IDeleteInput {
    _id: IMeeting['IParams']['_id'];
}

interface IEditInput {
    _id: IMeeting['IParams']['_id'];
    name: IMeeting['IParams']['name'];
    slug: IMeeting['IParams']['slug'];
    isActive: IMeeting['IParams']['isActive'];
    days: Pick<IDay, 'allDayLong' | 'finish' | 'start' | 'isodate'>[];
    gallery: Pick<IPicture, 'type' | 'h' | 'w' | 'url' | 's3Path'>[];
    participants: IParticipant[];
}

type IEditOutput = IMeeting['IParams'];

interface IUploadGalleryInput {
    meetingId: string;
    h: IPicture['h'];
    w: IPicture['w'];
}

type IUploadGalleryOutput = IMeeting['IParams'];

interface IRemoveFromGalleryInput {
    meetingId: string;
    s3Path: IPicture['s3Path'];
}

type IRemoveFromGalleryOutput = IMeeting['IParams'];

export interface IMeetingController {
    IPaginacao: {
        IInput: IPaginacaoInput;
        IOutput: IPaginacaoOutput;
    };
    IById: {
        IInput: IByIdInput;
        IOutput: IByIdOutput;
    };
    IBySlug: {
        IInput: IBySlugInput;
        IOutput: IBySlugOutput;
    };
    ICreate: {
        IInput: ICreateInput;
        IOutput: ICreateOutput;
    };
    IDelete: {
        IInput: IDeleteInput;
    };
    IEdit: {
        IInput: IEditInput;
        IOutput: IEditOutput;
    };
    IUploadGallery: {
        IInput: IUploadGalleryInput;
        IOutput: IUploadGalleryOutput;
    };
    IRemoveFromGallery: {
        IInput: IRemoveFromGalleryInput;
        IOutput: IRemoveFromGalleryOutput;
    };
}
