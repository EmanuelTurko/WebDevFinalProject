import express from 'express';
const router = express.Router();
import authController from '../controllers/auth_controller';
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *           example: 60d0fe4f5311236168a109ca
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: test
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: test123
 *         accessToken:
 *           type: string
 *           description: The access token for the user
 *           example: some-access-token
 *         refreshToken:
 *           type: array
 *           items:
 *             type: string
 *           description: The refresh tokens for the user
 *           example: [some-refresh-token]
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *           description: The posts created by the user
 *           example: [60d0fe4f5311236168a109ca]
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: The comments made by the user
 *           example: [60d0fe4f5311236168a109cb]
 *         likedPosts:
 *           type: array
 *           items:
 *             type: string
 *           description: The posts liked by the user
 *           example: [60d0fe4f5311236168a109cc]
 *         likesCount:
 *           type: number
 *           description: The number of likes the user has received
 *           example: 10
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user with a username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: test123
 *     responses:
 *       200:
 *         description: User successfully registered.
 *       400:
 *         description: Bad request.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     description: Log in a user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test123
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *       401:
 *         description: Unauthorized.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Refresh the access token using a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: some-refresh-token
 *     responses:
 *       200:
 *         description: Access token successfully refreshed.
 *       401:
 *         description: Unauthorized.
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Logout a user and invalidate the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: some-refresh-token
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *       401:
 *         description: Unauthorized.
 */
router.post('/logout', authController.logout);
router.post('/google', authController.googleSignIn);

export default router;