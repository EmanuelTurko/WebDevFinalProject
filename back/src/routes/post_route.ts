/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post related endpoints
 */

import express from 'express';
import PostController from '../controllers/post_controller';
const router = express.Router();
import { authMiddleware } from '../controllers/auth_controller';


/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: The text content of the post
 *           example: This is a post content
 *         imageUrl:
 *           type: string
 *           description: The URL of the image
 *           example: http://example.com/image.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the post
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the post
 *           example: 2023-01-01T00:00:00.000Z
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *           example: 60d0fe4f5311236168a109ca
 *         title:
 *           type: string
 *           description: The title of the post
 *           example: My First Post
 *         content:
 *           $ref: '#/components/schemas/Content'
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: The list of user ids who liked the post
 *           example: [ "60d0fe4f5311236168a109cb" ]
 *         likesCount:
 *           type: number
 *           description: The number of likes the post has received
 *           example: 10
 *         owner:
 *           type: string
 *           description: The id of the user who owns the post
 *           example: 60d0fe4f5311236168a109cc
 */


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', PostController.getAll.bind(PostController));
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get('/:id', PostController.getById.bind(PostController));

/**
 * @swagger
 * /posts?owner={username}:
 *   get:
 *     summary: Get posts by owner username
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the post owner
 *     responses:
 *       200:
 *         description: List of posts by the owner
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Posts not found
 */
router.get('/:username', PostController.getByOwner.bind(PostController));
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Post
 *               content:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     example: This is a post content
 *                   imageUrl:
 *                     type: string
 *                     example: http://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Post successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, PostController.create.bind(PostController));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Post Title
 *               content:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     example: Updated post content
 *                   imageUrl:
 *                     type: string
 *                     example: http://example.com/updated-image.jpg
 *     responses:
 *       200:
 *         description: Post successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.put('/:id', authMiddleware, PostController.update.bind(PostController));

/**
 * @swagger
 * /posts/{id}/like:
 *   put:
 *     summary: Like or unlike a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to like or unlike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the user liking the post
 *                 example: "64a87c94b55d57eaa657c22a"
 *     responses:
 *       200:
 *         description: Post successfully liked or unliked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post or user not found
 */
router.put('/:id/like',authMiddleware, PostController.like.bind(PostController));
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: Post successfully deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authMiddleware, PostController.delete.bind(PostController));


export default router;