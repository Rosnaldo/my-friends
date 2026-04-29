import { MeetingController } from '#controllers/meeting';
import upload from '#utils/image/multer-upload';
import { authorizeMiddleware } from '#middleware/authorize';
import { GetKeycloakUser } from '#middleware/get_keycloak_user';
import { GetUser } from '#middleware/get_user';
import type { Application } from 'express';
import { UserRole } from '@repo/shared-types';

export default (app: Application) => {
    app.get(
        '/meetings/list',
        async (req, res) => {
            const controller = new MeetingController();
            const params = controller.paginacao!.mapper(req.query);
            const either = await controller.paginacao!.get({ params });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either);
        }
    );
    app.get(
        '/meetings/by-slug',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.bySlug!.mapper(req.query);
            const either = await controller.bySlug!.get({ mapped });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either.data);
        }
    );
    app.get(
        '/meetings/by-id',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.byId!.mapper(req.query);
            const either = await controller.byId!.get({ mapped });
             if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either.data);
        }
    );
    app.post(
        '/meetings/create',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.create!.mapper(req.body);
            const either = await controller.create!.exec({ mapped });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either.data);
        }
    );
    app.put(
        '/meetings/edit',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.edit!.mapper({ _id: req.query._id, ...req.body });
            const either = await controller.edit!.exec({ mapped });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either.data);
        }
    );
    app.delete(
        '/meetings/delete',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.delete!.mapper(req.query);
            const either = await controller.delete!.exec({ mapped });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either);
        }
    );
     app.post(
        '/meetings/gallery/remove',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.removeFromGallery!.mapper({ _id: req.query._id, ...req.body });
            const either = await controller.removeFromGallery!.exec({ mapped });
            if (either.isError) {
                return res.status(400).send(either);
            }
            return res.status(200).send(either);
        }
    );
    app.post(
        '/meetings/gallery/upload',
        GetKeycloakUser,
        GetUser,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        upload.single('image'),
        async (req, res) => {
            try {
                const file = req.file as Express.Multer.File;

                const isImage = file.mimetype.startsWith('image/');
                const isVideo = file.mimetype.startsWith('video/');

                if (!isImage && !isVideo) {
                    return res.status(400).json({ error: 'Invalid file type' });
                }

                const controller = new MeetingController();
                const mapped = controller.uploadGallery!.mapper(req.query);
                const either = await controller.uploadGallery!.exec({ file, mapped });
                if (either.isError) {
                    return res.status(400).send(either);
                }
                return res.status(200).send(either.data);
            } catch (err) {
                res.status(500).json({ error: 'Failed to upload image' });
            }
        }
    );
};
