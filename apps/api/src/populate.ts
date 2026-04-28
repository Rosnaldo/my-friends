import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

dotenv.config({
    path: `.env.${process.env.API_NODE_ENV}`,
    override: true
});

import { getUserDao } from "#daos/singleton";
import { IUser } from "#schemas/user/types";
import { generateMeeting } from '#mock-meetings';
import { UserBuilder } from '#schemas/user/utils';
import { IUserAvatar } from '@repo/shared-types';
import properties from '#properties';
import { joinUrl } from '#utils/join_url';

type UserPick = Pick<IUser['IParams'], 'firstName' | 'lastName' | 'email' | 'role'> & {
    avatar: Pick<IUserAvatar, 's3Path'>;
};

const members: UserPick[] = [
    {
        firstName: "Andrey",
        lastName: "Tsuzuki",
        email: "andreytsuzuki@gmail.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/young-japanese-guy.jpg`
        },
        role: 'admin',
    },
    {
        firstName: "Lucas",
        lastName: "Silva",
        email: "lucas.silva@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/young-brazilian-man-smiling.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Mariana",
        lastName: "Costa",
        email: "mariana.costa@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/young-brazilian-woman-curly-hair.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Pedro",
        lastName: "Henrique",
        email: "pedro.henrique@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-man-beard-casual.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Juliana",
        lastName: "Alves",
        email: "juliana.alves@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-sunglasses-summer.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Rafael",
        lastName: "Santos",
        email: "rafael.santos@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/young-man-athletic-brazilian.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Camila",
        lastName: "Oliveira",
        email: "camila.oliveira@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-long-hair-smiling.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Bruno",
        lastName: "Ferreira",
        email: "bruno.ferreira@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-man-casual-style.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Amanda",
        lastName: "Ribeiro",
        email: "amanda.ribeiro@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-short-hair-modern.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Thiago",
        lastName: "Mendes",
        email: "thiago.mendes@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-man-glasses-friendly.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Fernanda",
        lastName: "Lima",
        email: "fernanda.lima@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-blonde-beach-style.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Gabriel",
        lastName: "Souza",
        email: "gabriel.souza@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-man-tattoo-arm.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Beatriz",
        lastName: "Rocha",
        email: "beatriz.rocha@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-fitness-style.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Diego",
        lastName: "Martins",
        email: "diego.martins@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-man-surfer-look.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Isabela",
        lastName: "Santos",
        email: "isabela.santos@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/brazilian-woman-elegant-style.jpg`
        },
        role: 'mock',
    },
    {
        firstName: "Matheus",
        lastName: "Lima",
        email: "matheus.lima@exemplo.com",
        avatar: {
            s3Path: `avatars/${properties.nodeEnv}/placeholder.svg?height=80&amp;width=80`
        },
        role: 'mock',
    },
];

export const populate = async () => {
    const promises = members.map(async (m) => {
        const builder = new UserBuilder();
        return await builder
            .setInit({
                firstName: m.firstName,
                lastName: m.lastName,
                email: m.email,
                role: m.role,
            })
            .setAvatar({
                url: joinUrl(properties.s3Host, m.avatar.s3Path),
                s3Path: m.avatar.s3Path,
            }).save();
    });
    await Promise.all(promises);
    const newMembers = await getUserDao().find({});

    const ids = newMembers.map((m) => m.id)

    await generateMeeting(ids)
}
