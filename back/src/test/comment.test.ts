import request from 'supertest';
import {Express} from 'express';
import mongoose from 'mongoose';
import appMain from '../server';
import userModel from '../models/user_model';
import postModel from '../models/post_model';
import { User } from '../models/user_model';
import commentModel from '../models/comment_model';
import { Comment } from '../models/comment_model';

let app: Express;
let baseUrl: string;

beforeAll (async () => {
    app = await appMain();
    await userModel.deleteMany({});
    await postModel.deleteMany({});
    await commentModel.deleteMany({});
    const res = await request(app)
        .post('/auth/register')
        .send(testUser);
    const res2 = await request(app)
        .post('/auth/login')
        .send(testUser);
    testUser.accessToken = res2.body.accessToken;
    testUser.refreshToken = res2.body.refreshToken;
    testUser._id = res2.body._id;
    const res3 = await request(app)
        .post('/posts')
        .set({authorization: 'jwt ' + testUser.accessToken})
        .send(testPost);
    testComment.postId = res3.body._id;

    baseUrl = '/posts/' + testComment.postId + '/comments';
})
afterAll(async () => {
    await mongoose.connection.close();
});

const testUser: User = {
    username: 'test',
    email: 'test@test.com',
    password: '123456',
}
const testPost = {
    content: {
        text: 'test content',
        imageUrl: 'test image url',
    },
    owner: testUser.username,
}
const testComment:Comment = {
    content: 'test comment',
    owner: testUser.username,
    likes: [],
    likesCount: 0,
}

describe('Comment Test', () => {
    test('Get Comments - Empty', async () => {
        const res = await request(app)
            .get(baseUrl);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
    test('Create Comment', async () => {
        const res = await request(app)
            .post(baseUrl)
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send(testComment);
        expect(res.status).toBe(201);
    });
    test('Get Comments - Not Empty', async () => {
        const res = await request(app)
            .get(baseUrl);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });
    test('Update Comment', async () => {
        const res = await request(app)
            .get(baseUrl);
        const commentId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+commentId)
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({content: 'updated comment'});
        expect(res2.status).toBe(200);
        expect(res2.body.content).toBe('updated comment');
    });
    test('Get Comment by Id - Not Found', async () => {
        const res = await request(app)
            .get(baseUrl+'/1');
        expect(res.status).toBe(404);
    });
    test('Get Comment by Id - Found', async () => {
        const res = await request(app)
            .get(baseUrl);
        const commentId = res.body[0]._id;
        const res2 = await request(app)
            .get(baseUrl+'/'+commentId);
        expect(res2.status).toBe(200);
    });
    test('Get Comment By Owner', async () => {
        const res = await request(app)
            .get(baseUrl+'?owner='+testUser.username);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });
    test('Like Comment', async () => {
        const res = await request(app)
            .get(baseUrl);
        const commentId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+commentId+'/like')
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({userId: testUser._id});
        expect(res2.status).toBe(200);
        expect(res2.body.likes).toContain(testUser.username);
        expect(res2.body.likesCount).toBe(1);
    });
    test('Unlike Comment', async () => {
        const res = await request(app)
            .get(baseUrl);
        const commentId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+commentId+'/like')
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({userId: testUser._id});
        expect(res2.status).toBe(200);
        expect(res2.body.likes).not.toContain(testUser.username);
        expect(res2.body.likesCount).toBe(0);
    });
    test('Delete Comment', async () => {
        const res = await request(app)
            .get(baseUrl);
        const commentId = res.body[0]._id;
        const res2 = await request(app)
            .delete(baseUrl+'/'+commentId)
            .set({authorization: 'jwt ' + testUser.accessToken});
        expect(res2.status).toBe(200);
        const res3 = await request(app)
            .get(baseUrl);
        expect(res3.body.length).toBe(0);
    });



});