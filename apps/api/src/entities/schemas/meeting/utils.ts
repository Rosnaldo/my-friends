import z from 'zod';
import { Types } from 'mongoose';
import { makeSmallStringSchema, makeStringSchema } from '#utils/zod/valid_small_string';

import { IDaySchema, IMeeting, IParticipantSchema, IPictureSchema } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeDateSchema } from '#utils/zod/valid_date';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { IDay, IParticipant, IPicture, ParticipantStatusAll, PictureTypeAll, WeekdayAll } from '@repo/shared-types';
import { makeNumberSchema } from '#utils/zod/valid_number';
import { makeBooleanSchema } from '#utils/zod/valid_boolean';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { makeUrlSchema } from '#utils/zod/valid_url';
import { toSlug } from '#utils/to_slug';
import { getMeetingModel } from '#models/singleton';
import properties from '#properties';
import { notNil } from '#utils/not_nil';
import _ from 'lodash';
import { hasNoNilValues } from 'src/utils/has_no_nil_values';

export class MeetingUtils {
    public readonly zodDaySchema = z.object({
        _id: makeObjectIdSchema('_id'),
        day: makeNumberSchema('day'),
        month: makeNumberSchema('month'),
        year: makeNumberSchema('year'),
        formatted: makeSmallStringSchema('formatted'),
        start: makeSmallStringSchema('start').optional(),
        finish: makeSmallStringSchema('finish').optional(),
        weekday: makeEnumSchema(WeekdayAll, 'weekday'),
        isodate: makeDateSchema('isodate'),
        allDayLong: makeBooleanSchema('allDayLong'),
    });

    public readonly zodPictureSchema = z.object({
        _id: makeObjectIdSchema('_id'),
        cdnHost: makeStringSchema('cdnHost').optional(),
        s3Host: makeStringSchema('s3Host'),
        s3Path: makeStringSchema('s3Path'),
        url: makeUrlSchema('url'),
        type: makeEnumSchema(PictureTypeAll, 'type'),
        h: makeNumberSchema('h'),
        w: makeNumberSchema('w'),
    });

    public readonly zodParticipantSchema = z.object({
        userId: makeObjectIdSchema('userId'),
        status: makeEnumSchema(ParticipantStatusAll, 'status'),
    });

    public readonly zodSchema = z.object({
        _id: makeObjectIdSchema('_id'),
        name: makeSmallStringSchema('name'),
        slug: makeSmallStringSchema('slug'),
        isActive: makeBooleanSchema('isActive'),
        days: z.array(this.zodDaySchema),
        gallery: z.array(this.zodPictureSchema),
        participants: z.array(this.zodParticipantSchema),
        createdAt: makeDateSchema('createdAt'),
        updatedAt: makeDateSchema('updatedAt'),
    });

    public readonly toObject = (meeting: IMeeting['IDocument']): IMeeting['IParams'] => {
        const object = cleanMongooseObject(meeting);
        return {
            ...object,
            _id: meeting?._id?.toString(),
            days: (object.days || []).map((obj: any) => ({
                ...obj,
                _id: obj?._id?.toString(),
            })),
            gallery: (object.gallery || []).map((obj: any) => ({
                ...obj,
                _id: obj?._id?.toString(),
            })),
            participants: meeting?.participants?.map((obj: IParticipantSchema) => {
                return {
                    userId: obj?.userId?.toString(),
                    status: obj?.status,
                } satisfies IParticipant;
            })
        };
    };
}

export type IInitBuilder = {
    _id?: IMeeting['IParams']['_id'];
    name: IMeeting['IParams']['name'];
    isActive: IMeeting['IParams']['isActive'];
}

export type IPicturePickedBuilder = {
    _id?: IPicture['_id'];
    type: IPicture['type'];
    w: IPicture['w'];
    h: IPicture['h'];
    url: IPicture['url'];
    s3Path: IPicture['s3Path'];
}

export type IDayPickedBuilder = {
    _id?: IDay['_id'];
    start?: IDay['start'];
    finish?: IDay['finish'];
    allDayLong: IDay['allDayLong'];
    isodate: IDay['isodate'];
}

export type IMeetingPickedBuilder = {
    name: IMeeting['IParams']['name'];
    isActive: IMeeting['IParams']['isActive'];
    gallery: IPicturePickedBuilder[];
    days: IDayPickedBuilder[];
    participants: IParticipant[];
}

export class MeetingBuilder {
    public readonly utils = new MeetingUtils();
    public readonly doc: IMeeting['IDocument'];

    constructor(doc: IMeeting['IDocument'] | null = null) {
        const MeetingModel = getMeetingModel();
        if (doc != null) this.doc = doc;
        else this.doc = new MeetingModel();
    }

    public readonly build = (params: Partial<IMeetingPickedBuilder>): this => {
        const { name, isActive, gallery, days, participants } = params;

        const update = { name, isActive };
        if (hasNoNilValues(update)) {
            this.update(update);
        }

        if (gallery) {
            this.setGallery(gallery);
        }

        if (days) {
            this.setDays(days);
        }

        if (participants) {
            this.setParticipants(participants);
        }

        return this;
    };

    public readonly create = (params: IInitBuilder): this => {
        const { name, isActive, _id } = params;
        const slug = toSlug(name);

        if (notNil(_id)) {
            this.doc._id = new Types.ObjectId(_id);
        }
        this.doc.name = name;
        this.doc.slug = slug;
        this.doc.isActive = isActive;

        return this;
    };

    public readonly update = (params: Partial<IInitBuilder>): this => {
        const { name, isActive } = params;

        this.doc.name = (_.isNil(name)) ? this.doc.name : name;
        this.doc.isActive = (_.isNil(isActive)) ? this.doc.isActive : isActive;

        return this;
    };

    public readonly setParticipants = (participants: IParticipant[]): this => {
        this.doc.participants = participants.map((p) => ({
            userId: new Types.ObjectId(p.userId),
            status: p.status,
        } satisfies IParticipantSchema));
        return this;
    };

    public readonly setGallery = (gallery: IPicturePickedBuilder[]): this => {
        this.doc.gallery = gallery.map((g) => ({
            ...g,
            ...(g?._id ? { _id: new Types.ObjectId(g._id) } : { _id: new Types.ObjectId() }),
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
        } satisfies IPictureSchema));
        return this;
    };

    public readonly addToGallery = (p: IPicturePickedBuilder): this => {
        this.doc.gallery?.push({
            ...p,
            ...(_.isNil(p?._id) ? { _id: new Types.ObjectId() } : { _id: new Types.ObjectId(p._id) }),
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
        } satisfies IPictureSchema);
        return this;
    };

    public readonly setDays = (days: IDayPickedBuilder[]): this => {
        this.doc.days = days.map(d => {
            const isoDate = new Date(d.isodate);
            const dayNumber = isoDate.getDate() + 1;
            const weekdayNumber = isoDate.getDay();
            const monthNumber = isoDate.getMonth() + 1;
            const year = isoDate.getFullYear();

            function formatDDMMYYYY(date: Date): string {
                const day = String(date.getDate() + 1).padStart(2, "0"); // garante 2 dígitos
                const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-11 → 1-12
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;
            }

            return {
                ...(_.isNil(d?._id) ? { _id: new Types.ObjectId() } : { _id: new Types.ObjectId(d._id) }),
                start: d.start,
                finish: d.finish,
                isodate: isoDate,
                day: dayNumber,
                month: monthNumber,
                year,
                weekday: WeekdayAll[weekdayNumber],
                formatted: formatDDMMYYYY(isoDate),
                allDayLong: d.allDayLong,
            } satisfies IDaySchema
        });
        return this;
    };

    public readonly save = async (): Promise<IMeeting['IParams']> => {
        await this.doc.save();
        return this.utils.toObject(this.doc);
    };
}
