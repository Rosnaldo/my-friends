import { Request } from 'express';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { EitherList, successData } from '#utils/either_list';
import { MeetingCrud } from '#crud/meeting';
import { UserRole, type IParticipant } from '@repo/shared-types';
import { toUndefined } from '#utils/mapper/to_undefined';
import { validateInput } from 'src/validations/user/participants';
import { BadRequestException } from '#exceptions/bad_request';
import _ from 'lodash';

type IInput = IUserController['IParticipants']['IInput'];
type IOutput = IUserController['IParticipants']['IOutput'];

interface Props {
    params: IInput;
    user: IUser['IParams'];
}

export class Participants {
    public readonly classId = Symbol.for('Controller > User > Participants');
    private readonly crud: UserCrud;
    private readonly crudMeeting: MeetingCrud;

    private constructor() {
        this.crud = new UserCrud();
        this.crudMeeting = new MeetingCrud();
    }

    static construir(classId: symbol): Participants {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Participants();
    }

    public readonly get = async (props: Props): Promise<EitherList<IOutput>> => {
        try {
            const input = this.transform(props.params);
            const { meetingId, slug } = input;

            const query = {
                ...(_.isNil(meetingId)) ? {} : { _id: meetingId },
                ...(_.isNil(slug)) ? {} : { slug },
            };

            const meeting = await this.crudMeeting.findOne(query);
            if (_.isNil(meeting)) {
                throw new BadRequestException('Meeting not found')
            }

            const participantIds = meeting.participants.map((p) => p.userId);
            const queryRole = {
                ...(meeting.isActive) ? { role: { $in: [UserRole.admin, UserRole.member] } } : {}
            };
            const list = await this.crud.find({ _id: { $in: participantIds }, ...queryRole });

            const participantsDict: Record<string, { value: IParticipant }> =
                meeting.participants.transformInDict('userId');

            const result = list.map((l) => ({
                ...l,
                status: participantsDict[l._id].value.status,
            }));

            return successData(result);
        } catch (error: unknown) {
            return logError(error, '/users/participants');
        }
    };

    public readonly mapper = (body: Request['body']): IInput => {
        const {
            meetingId,
            slug,
        } = body;

        return {
            ...(meetingId ? { meetingId: toUndefined('meetingId', meetingId) } : {}),
            ...(slug ? { slug: toUndefined('slug', slug) } : {}),
        };
    };

    public readonly transform = (params: IInput): IInput => {
        const zodResult = validateInput(params);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IInput;
    };
}
