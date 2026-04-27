export const ParticipantStatus = {
    confirmed: 'confirmed',
    pending: 'pending',
} as const;

export const ParticipantStatusAll = [
    ParticipantStatus.confirmed,
    ParticipantStatus.pending,
];

export const UserRole = {
    admin: 'admin',
    member: 'member',
    mock: 'mock',
} as const;

export const UserRoleAll = [
    UserRole.admin,
    UserRole.member,
    UserRole.mock,
];

export interface IMedia {
    _id: string;
    url: string;
    s3Path: string;
    s3Host: string;
    cdnHost?: string;
};

export interface IUserAvatar extends IMedia {};

export interface IUser {
    _id: string;
    slug: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    avatar?: IUserAvatar;
    role: keyof typeof UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface IParticipant {
    userId: string;
    status: keyof typeof ParticipantStatus;
}

export type IUserParticipant = IUser & Omit<IParticipant, 'userId'>

export const WeekdayName = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terca-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
} as const;

export const Weekday = {
  sunday: "sunday",
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
} as const;

export const WeekdayAll = [
    Weekday.sunday,
    Weekday.monday,
    Weekday.tuesday,
    Weekday.wednesday,
    Weekday.thursday,
    Weekday.friday,
    Weekday.saturday,
];

export interface IDay {
    _id: string;
    day: number;
    month: number;
    year: number;
    formatted: string;
    start?: string;
    finish?: string;
    weekday: keyof typeof Weekday;
    isodate: Date;
    allDayLong: boolean;
}

export const PictureType = {
    video: 'video',
    image: 'image',
} as const;

export const PictureTypeAll = [
    PictureType.video,
    PictureType.image,
];

export interface IPicture extends IMedia {
    type: keyof typeof PictureType;
    w: number;
    h: number;
};

export interface IMeeting {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
    days: Array<IDay>;
    gallery: Array<IPicture>;
    participants: Array<IParticipant>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    size: number;
};

export const getInitials = (firstName: string) => {
    if (!firstName) return 'U';
    return firstName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getFullname = (user?: IUser | IUserParticipant) => `${user?.firstName} ${user?.lastName}`;

export class UserUtils {
    public readonly getFullname = (user?: IUser) => `${user?.firstName} ${user?.lastName}`;

    public readonly getInitials = (user?: IUser) => {
        const name = user?.firstName;
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    public readonly getAvatarColor = (
        colors: readonly string[],
        user?: IUser
    ) => {
        if (!colors.length) return '';

        const seed = user?.email || user?._id || '';
        let hash = 0;

        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }

        return colors[Math.abs(hash) % colors.length];
    };
};

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[] // handle arrays
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
