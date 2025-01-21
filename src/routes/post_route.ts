import express from 'express';
import PostController from "../controllers/post_controller";
const router = express.Router();
import {authMiddleware} from '../controllers/auth_controller';

router.get('/', PostController.getAll.bind(PostController));
router.get('/:id', PostController.getById.bind(PostController));
router.get('/:username', PostController.getByOwner.bind(PostController));
router.post('/',authMiddleware, PostController.create.bind(PostController));
router.put('/:id',authMiddleware, PostController.update.bind(PostController));
router.delete('/:id',authMiddleware, PostController.delete.bind(PostController));
router.put('/:id/like',authMiddleware, PostController.like.bind(PostController));

export default router;