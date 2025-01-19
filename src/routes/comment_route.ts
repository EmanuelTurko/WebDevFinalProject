import express from 'express';
import CommentController from "../controllers/comment_controller";
const router = express.Router();

router.get('/', CommentController.getAll.bind(CommentController));
router.get('/:id', CommentController.getById.bind(CommentController));
router.post('/', CommentController.create.bind(CommentController));
router.put('/:id', CommentController.update.bind(CommentController));
router.delete('/:id', CommentController.delete.bind(CommentController));
router.put('/:id/like', CommentController.like.bind(CommentController));

export default router;