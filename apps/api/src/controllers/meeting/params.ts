import { IMeeting } from "#schemas/meeting/types";
import { IPicture } from "@repo/shared-types";

interface IByIdInput {
    _id: string;
}

type IByIdOutput = IMeeting['IParams'];

interface IBySlugInput {
    slug: string;
}

type IBySlugOutput = IMeeting['IParams'];

interface IPaginacao {
    page: number;
    pageSize: number;
}

interface ICriacao {
    name: IMeeting['IParams']['name'];
}

interface IDelete {
    _id: IMeeting['IParams']['_id'];
}

interface IEdit {
    _id: IMeeting['IParams']['_id'];
    name: IMeeting['IParams']['name'];
    slug: IMeeting['IParams']['slug'];
    isActive: IMeeting['IParams']['isActive'];
    days: IMeeting['IParams']['days'];
    gallery: IMeeting['IParams']['gallery'];
    participants: IMeeting['IParams']['participants'];
}

interface IUploadGallery {
    meetingId: string;
    h: IPicture['h'];
    w: IPicture['w'];
}

interface IRemoveFromGallery {
    meetingId: string;
    s3Path: IPicture['s3Path'];
}

export interface IMeetingController {
    IPaginacao: IPaginacao;
    IById: {
        IInput: IByIdInput;
        IOutput: IByIdOutput;
    };
    IBySlug: {
        IInput: IBySlugInput;
        IOutput: IBySlugOutput;
    };
    ICriacao: ICriacao;
    IDelete: IDelete;
    IEdit: IEdit;
    IUploadGallery: IUploadGallery;
    IRemoveFromGallery: IRemoveFromGallery;
}
