import express from 'express';
import CommentController from "../controllers/comment_controller";
import {authMiddleware} from "../controllers/auth_controller";
const router = express.Router();

router.get('/', CommentController.getAll.bind(CommentController));
router.get('/:id', CommentController.getById.bind(CommentController));
router.post('/',authMiddleware, CommentController.create.bind(CommentController));
router.put('/:id',authMiddleware, CommentController.update.bind(CommentController));
router.delete('/:id',authMiddleware, CommentController.delete.bind(CommentController));
router.put('/:id/like',authMiddleware, CommentController.like.bind(CommentController));

export default router;