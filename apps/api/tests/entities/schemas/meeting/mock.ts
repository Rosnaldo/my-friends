import { Types } from 'mongoose';
import Chance from 'chance';

import { MeetingBuilder } from 'src/entities/schemas/meeting/utils';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import properties from 'src/properties';
import { IDay, IParticipant, IPicture, ParticipantStatus } from '@repo/shared-types';

const chance = new Chance();

type IParams = {
    init: Partial<IMeeting['IParams']>;
    days: Partial<IDay>[];
    gallery: Partial<IPicture>[];
    participants: Partial<IParticipant>[];
}

export const mockMeeting = (params: IParams): MeetingBuilder => {
    const builder = new MeetingBuilder();

    builder
        .create({
            _id: params?.init._id ?? new Types.ObjectId().toString(),
            name: params?.init.name ?? chance.name(),
            isActive: params?.init.isActive ?? chance.bool(),
        })
        .setDays(
            params.days.map((d) => ({
                _id: d?._id ?? new Types.ObjectId().toString(),
                start: d?.start ?? '7:00',
                finish: d?.finish ?? '22:00',
                isodate: d?.isodate ?? new Date(),
                allDayLong: d?.allDayLong ?? chance.bool(),
            }))
        )
        .setGallery(
            params.gallery.map((g) => ({
                _id: g?._id ?? new Types.ObjectId().toString(),
                type: g?.type ?? (chance.bool() ? 'image' : 'video'),
                url: g?.url ?? new URL('https://example.com').toString(),
                s3Path: g?.s3Path ?? `meetings/${properties.nodeEnv}/chacara-meets/gallery/anime-style-night-party-lights-japanese.jpg`,
                w: g?.w ?? chance.natural({ min: 1, max: 4 }),
                h: g?.h ?? chance.natural({ min: 1, max: 4 }),
            }))
        )
        .setParticipants(
            params.participants.map((p) => ({
                userId: p?.userId ?? new Types.ObjectId().toString(),
                status: p?.status ?? ParticipantStatus.confirmed,
            }))
        );

    return builder;
}
