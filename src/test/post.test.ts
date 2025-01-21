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
    const res = await request(app).post('/auth/register').send(testUser);
    const res2= await request(app).post('/auth/login').send(testUser);
    testUser.accessToken = res2.body.accessToken;
    testUser.refreshToken = res2.body.refreshToken;
});
afterAll(async () => {
    await mongoose.connection.close();
});
const testUser : User = {
    username: 'test',
    email: 'test@test.com',
    password:'123456',
}
const testPost = {
    title: 'test title',
    content:{
        text: 'test content',
        imageUrl: 'test image url',
    },
    owner: testUser.username,
}
const baseUrl = '/posts';
describe('Post Test', ()=> {
    test('Get Posts - Empty', async () => {
        const res = await request(app)
            .get(baseUrl);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
    test('Create Post', async () => {
        const res = await request(app)
            .post(baseUrl)
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send(testPost);
        expect(res.status).toBe(201);
    });
    test('Get Posts - Not Empty', async () => {
        const res = await request(app)
            .get(baseUrl);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });
    test('Update Post', async () => {
        const res = await request(app)
            .get(baseUrl);
        const postId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+postId)
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({title: 'updated title'});
        expect(res2.status).toBe(200);
        expect(res2.body.title).toBe('updated title');
    });
    test('Get Post by Id - Not Found', async () => {
        const res = await request(app)
            .get(baseUrl+'/1');
        expect(res.status).toBe(404);
    });
    test('Get Post by Id - Found', async () => {
        const res = await request(app)
            .get(baseUrl);
        const postId = res.body[0]._id;
        const res2 = await request(app)
            .get(baseUrl+'/'+postId);
        expect(res2.status).toBe(200);
    });
    test('Get Post By Owner', async () => {
        const res = await request(app)
            .get(baseUrl+'?owner='+testUser.username);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });
    test('Like Post', async () => {
        const res = await request(app)
            .get(baseUrl);
        const postId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+postId+'/like')
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({userId: testUser.username});
        expect(res2.status).toBe(200);
        expect(res2.body.likesCount).toBe(1);
    });
    test('Unlike Post', async () => {
        const res = await request(app)
            .get(baseUrl);
        const postId = res.body[0]._id;
        const res2 = await request(app)
            .put(baseUrl+'/'+postId+'/like')
            .set({authorization: 'jwt ' + testUser.accessToken})
            .send({userId: testUser.username});
        expect(res2.status).toBe(200);
        expect(res2.body.likesCount).toBe(0);
    });
    test('Delete Post', async () => {
        const res = await request(app)
            .get(baseUrl);
        const postId = res.body[0]._id;
        const res2 = await request(app)
            .delete(baseUrl+'/'+postId)
            .set({authorization: 'jwt ' + testUser.accessToken});
        expect(res2.status).toBe(200);
        const res3 = await request(app)
            .get(baseUrl);
        expect(res3.body.length).toBe(0);
    });
});
