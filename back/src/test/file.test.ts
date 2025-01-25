import request from 'supertest';
import { Express } from 'express';
import appMain from '../server';
import mongoose from 'mongoose';
import {after} from "node:test";

let app: Express;

beforeAll(async () => {
    app = await appMain();
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('File Test', () => {
    it('upload file', async () => {
        const path = `${__dirname}/test_file.txt`;
        try{
            const response = await request(app)
                .post('/file?file=test_file.txt')
                .attach('file', path);
            expect(response.statusCode).toBe(200);
            let url = response.body.url;
            url = url.replace(/^.*\/\/[^/]+/, '');
            const res = await request(app).get(url);
            expect(res.statusCode).toBe(200);
        } catch(err:any) {
            console.error(err);
        }
    });
});