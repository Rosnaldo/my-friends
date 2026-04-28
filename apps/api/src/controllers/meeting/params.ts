import { IMeeting } from "#schemas/meeting/types";
import { IDay, IParticipant, IPicture } from "@repo/shared-types";

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

interface ICreateInput {
    name: IMeeting['IParams']['name'];
}

type ICreateOutput = IMeeting['IParams'];

interface IDelete {
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
    ICreate: {
        IInput: ICreateInput;
        IOutput: ICreateOutput;
    };
    IDelete: IDelete;
    IEdit: {
        IInput: IEditInput;
        IOutput: IEditOutput;
    };
    IUploadGallery: IUploadGallery;
    IRemoveFromGallery: IRemoveFromGallery;
}
