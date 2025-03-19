import request from 'supertest';
import {Express} from 'express';
import mongoose from 'mongoose';
import appMain from '../server';
import userModel from '../models/user_model';
import postModel from '../models/post_model';
import { User } from '../models/user_model';

let app: Express;

beforeAll(async () => {
    app = await appMain();
    await userModel.deleteMany({});
    await postModel.deleteMany({});
});
afterAll(async () => {
    await mongoose.connection.close();
});

const baseUrl = '/auth';

const testUser: User = {
    username: 'test',
    email: 'test@test.com',
    password: '123456',

}

describe('Auth Register Test', ()=> {
    test('Register', async () => {
        const res = await request(app)
            .post(baseUrl+'/register')
            .send(testUser);
        expect(res.status).toBe(200);
    });
    test('Register - username is required', async () => {
        const res = await request(app)
            .post(baseUrl+'/register')
            .send({
                    email: 'test1@test1.com',
                    password: '123456',
                }
            );
        expect(res.status).toBe(400);
    });
    test('Register - username already exists', async () => {
        const res = await request(app)
            .post(baseUrl+'/register')
            .send(testUser);
        expect(res.status).toBe(400);
    });
    test('Register - email is required', async () => {
        const res = await request(app)
            .post(baseUrl+'/register')
            .send({
                    username: 'test1',
                    password: '123456',
                }
            );
        expect(res.status).toBe(400);
    });
    test('Register - email already exists', async () => {
        const res = await request(app)
            .post(baseUrl+'/register')
            .send({
                    username: 'test1',
                    email: 'test@test.com',
                    password: '123456',
            });
        expect(res.status).toBe(400);
    });
    test('Register - password is required', async () => {
        const res = await request(app)
            .post(baseUrl + '/register')
            .send({
                username: 'test1',
                email: 'test1@test1.com',
            });
        expect(res.status).toBe(400);
    });
    test('Register - password must be at least 6 characters', async () => {
        const res = await request(app)
            .post(baseUrl + '/register')
            .send({
                username: 'test1',
                email: 'test1@test.com',
                password: '123',
            });
        expect(res.status).toBe(400);
    });
})
describe('Auth Login Test', () => {
    test('Login', async () => {
        const res = await request(app)
            .post(baseUrl + '/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            });
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        expect(res.body._id).toBeDefined();
        testUser.accessToken = res.body.accessToken;
        testUser.refreshToken = res.body.refreshToken;
    });
    test('Login - invalid credentials password', async () => {
        const res = await request(app)
            .post(baseUrl + '/login')
            .send({
                username: testUser.username,
                password: '1234567',
            });
        expect(res.status).toBe(401);
    });
    test('Login - invalid credentials username', async () => {
        const res = await request(app)
            .post(baseUrl + '/login')
            .send({
                username: 'test1',
                password: testUser.password,
            });
        expect(res.status).toBe(401);
    });
    test('Login - make sure tokens are different', async () => {
        const res = await request(app)
            .post(baseUrl + '/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            });
        expect(res.status).toBe(200);
        expect(res.body.accessToken).not.toBe(testUser.accessToken);
        expect(res.body.refreshToken).not.toBe(testUser.refreshToken);
        testUser.accessToken = res.body.accessToken;
        testUser.refreshToken = res.body.refreshToken;
    });
})
describe('Middleware Test', () => {
    test('Middleware - no token', async () => {
        const res = await request(app)
            .post('/posts')
            .send({
                content: {
                    text: 'This is the first post',
                    imageUrl: 'https://example.com/image.jpg',
                },
                owner: testUser.username,
            })
        const res2 = await request(app)
            .get('/posts');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
        expect(res.status).toBe(405);
    });
    test('Middleware - invalid token', async () => {
        const res = await request(app)
            .post('/posts')
            .send({
                content: {
                    text: 'This is the first post',
                    imageUrl: 'https://example.com/image.jpg',
                },
                owner: testUser.username,
            })
            .set({authorization: 'JWT' + testUser.accessToken+'f'});
        const res2 = await request(app)
            .get('/posts');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
        expect(res.status).toBe(405);
    });
    test('Middleware - valid token', async () => {
        const res = await request(app)
            .post('/posts')
            .send({
                content: {
                    text: 'This is the first post',
                    imageUrl: 'https://example.com/image.jpg',
                },
                owner: testUser.username,
            })
            .set({authorization: 'JWT ' + testUser.accessToken});
        const res2 = await request(app)
            .get('/posts');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(1);
        expect(res.status).toBe(201);
    });
});
describe('Auth Refresh Test', () => {
    test('Refresh', async () => {
        const res = await request(app)
            .post(baseUrl + '/refresh')
            .send({
                refreshToken: testUser.refreshToken,
            });
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        testUser.accessToken = res.body.accessToken;
        testUser.refreshToken = res.body.refreshToken;
    });
    test('Refresh - missing refreshToken', async () => {
        const res = await request(app)
            .post(baseUrl + '/refresh')
            .send({});
        expect(res.status).toBe(403);
    });
    test('Refresh - invalid refreshToken', async () => {
        const res = await request(app)
            .post(baseUrl + '/refresh')
            .send({
                refreshToken: testUser.refreshToken+'f',
            });
        expect(res.status).toBe(403);
    });
});
describe('Auth Logout Test', () => {
    test('Logout', async () => {
        const res0 = await request(app)
            .post(baseUrl + '/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            });
        testUser.accessToken = res0.body.accessToken;
        testUser.refreshToken = res0.body.refreshToken;
        const res = await request(app)
            .post(baseUrl + '/logout')
            .send({
                refreshToken: testUser.refreshToken,
            });
        testUser.refreshToken = res.body.refreshToken;
        expect(res.status).toBe(200);
    });
    test('Logout - missing refreshToken', async () => {
        const res = await request(app)
            .post(baseUrl + '/logout')
            .send({});
        expect(res.status).toBe(400);
    });
    test('Logout - invalid refreshToken', async () => {
        const res = await request(app)
            .post(baseUrl + '/logout')
            .send({
                refreshToken: testUser.refreshToken,
            });
        expect(res.status).toBe(400);
    });
});
