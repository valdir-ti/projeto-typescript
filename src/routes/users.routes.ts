import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter
  .post('/', async (req, res) => {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return res.status(201).json(user);
  })
  .patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (req, res) => {
      const updateUserAvatarService = new UpdateUserAvatarService();

      const user = await updateUserAvatarService.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      });

      delete user.password;

      return res.status(201).json(user);
    },
  );

export default usersRouter;
