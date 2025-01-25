import express from 'express';
import CommentController from "../controllers/comment_controller";
import {authMiddleware} from "../controllers/auth_controller";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *         owner:
 *           type: string
 *           description: The ID of the comment owner
 *         postId:
 *           type: string
 *           description: The ID of the post the comment belongs to
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs who liked the comment
 *         likesCount:
 *           type: integer
 *           description: The number of likes
 */
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve a list of comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Retrieve a single comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: A single comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comment not found
 */


/**
 * @swagger
 * /comments/{id}/like:
 *   put:
 *     summary: Like or unlike a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user liking the comment
 *     responses:
 *       200:
 *         description: The updated comment with like status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */


router.get('/', CommentController.getAll.bind(CommentController));
router.get('/:id', CommentController.getById.bind(CommentController));
router.post('/',authMiddleware, CommentController.create.bind(CommentController));
router.put('/:id',authMiddleware, CommentController.update.bind(CommentController));
router.put('/:id/like',authMiddleware, CommentController.like.bind(CommentController));
router.delete('/:id',authMiddleware, CommentController.delete.bind(CommentController));

export default router;