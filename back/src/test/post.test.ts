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
    await request(app).post('/auth/register').send(testUser);
    const res2= await request(app).post('/auth/login').send(testUser);
    await request(app).post('/auth/register').send(testUser2);
    const res3= await request(app).post('/auth/login').send(testUser2);
    testUser.accessToken = res2.body.accessToken;
    testUser.refreshToken = res2.body.refreshToken;
    testUser._id = res2.body._id;
    testUser2.accessToken = res3.body.accessToken;
    testUser2.refreshToken = res3.body.refreshToken;
    testUser2._id = res3.body._id;
});
afterAll(async () => {
    await mongoose.connection.close();
});
const testUser : User = {
    username: 'test',
    email: 'test@test.com',
    password:'123456',
}
const testUser2 : User = {
    username: 'test2',
    email: 'test@test2.com',
    password:'123456',
}
const testPost = {
    content:{
        text: 'test content',
        imageUrl: 'test image url',
    },
    owner: testUser.username,
}
let likepostId = '';
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
        likepostId = res.body._id;

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
            .put(baseUrl + '/' + postId)
            .set({ authorization: 'jwt ' + testUser.accessToken })
            .send({ content: { text: 'updated content', imageUrl: 'blank' } });
        expect(res2.status).toBe(200);
        expect(res2.body.content.text).toBe('updated content');
        expect(res2.body.content.imageUrl).toBe('blank');
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
        const res2 = await request(app)
            .put(baseUrl+'/'+likepostId+'/like')
            .set({authorization: 'jwt ' + testUser2.accessToken})
            .send({userId: testUser2._id});
        expect(res2.status).toBe(200);
        expect(res2.body.likes).toContain(testUser2.username);
        expect(res2.body.likesCount).toBe(1);
    });
    test('Unlike Post', async () => {
        const res = await request(app)
            .get(baseUrl);
        const res2 = await request(app)
            .put(baseUrl+'/'+likepostId+'/like')
            .set({authorization: 'jwt ' + testUser2.accessToken})
            .send({userId: testUser2._id});
        expect(res2.status).toBe(200);
        expect(res2.body.likes).not.toContain(testUser2.username);
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
