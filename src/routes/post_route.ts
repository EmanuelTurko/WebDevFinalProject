import express from 'express';
import PostController from "../controllers/post_controller";
const router = express.Router();

router.get('/', PostController.getAll.bind(PostController));
router.get('/:id', PostController.getById.bind(PostController));
router.post('/', PostController.create.bind(PostController));
router.put('/:id', PostController.update.bind(PostController));
router.delete('/:id', PostController.delete.bind(PostController));
router.put('/:id/like', PostController.like.bind(PostController));

export default router;