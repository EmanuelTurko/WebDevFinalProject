import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response,NextFunction } from 'express';
import mongoose from 'mongoose';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
dotenv.config();

const generateTokens = (_id: string): {accessToken:string, refreshToken:string} | null => {
    const rand = Math.floor(Math.random() * 1000000000);
    if(process.env.TOKEN_SECRET === undefined){
        return null;
    }
    if(process.env.TOKEN_EXP === undefined){
        return null;
    }
    if(process.env.REFRESH_TOKEN_EXP === undefined){
        return null;
    }
    const accessToken = jwt.sign(
        {
            _id: _id,
            rand: rand,
        },
        process.env.TOKEN_SECRET,
        {expiresIn: process.env.TOKEN_EXP},
    );
    const refreshToken = jwt.sign(
        {
            _id: _id,
            rand: rand,
        },
        process.env.TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXP},
    )
    return {accessToken, refreshToken};
}
const register = async (req: Request, res: Response) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const findUser = await userModel.findOne({ username: email });
    const findEmail = await userModel.findOne({ email: email });
    if(!username){
        res.status(400).send("username is required");
        return;
    }
    if(findUser != null){
        res.status(400).send("username already exists");
        return;
    }
    if(!email){
        res.status(400).send("email is required");
        return;
    }
    if(findEmail != null){
        res.status(400).send("email already exists");
        return;
    }
    if(!password){
        res.status(400).send("password is required");
        return;
    }
    if(password.length < 6){
        res.status(400).send("password must be at least 6 characters");
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            username: username,
            email: email,
            password: hashedPassword,
        });
        await user.save();
        res.status(200).send(user);
        return;
    } catch(err:any){
        res.status(400).send(err.message);
    }
}
const login = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await userModel.findOne({username: username});
        if (!user) {
            res.status(401).send("incorrect username or password");
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).send("incorrect username or password");
            return;
        }
        const tokens = generateTokens(user._id.toString());
        if (!tokens) {
            res.status(401).send("server error");
            return;
        }
        if (user.refreshToken === undefined) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            username: user.username,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch(err:any){
        res.status(401).send(err.message);
    }
}
const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(402).send("Missing refreshToken");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(402).send("server error");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, user: any) => {
        if (err) {
            res.status(402).send("invalid token");
            return;
        }
        const userId = user._id;
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(402).send("internal error");
                return;
            }
            if (!user.refreshToken || user.refreshToken.includes(refreshToken) === undefined) {
                user.refreshToken = [];
                await user.save();
                res.status(402).send("invalid token");
                return;
            }
            user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
            await user.save();
            res.status(200).send("logout successful");
        } catch (err: any) {
            res.status(402).send(err.message);
        }
    });
}
const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(403).send("Missing refreshToken");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(403).send("server error");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, user: any) => {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        const userId = user._id;
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(403).send("internal error");
                return;
            }
            if (!user.refreshToken || user.refreshToken.includes(refreshToken) === undefined) {
                user.refreshToken = [];
                await user.save();
                res.status(402).send("invalid token");
                return;
            }
            const newTokens = generateTokens(userId);
            if (!newTokens) {
                user.refreshToken = [];
                await user.save();
                res.status(403).send("server error");
                return;
            }
            user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
            user.refreshToken.push(newTokens.refreshToken);
            await user.save();
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch (err: any) {
            res.status(403).send(err.message);
        }
    });
}
type Payload = {
    _id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];
    if (!token) {
        res.status(405).send("Access denied");
        return;
    }
    if (process.env.TOKEN_SECRET === undefined) {
        res.status(405).send("server error");
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err: any, payload) => {
        if (err) {
            res.status(405).send("Access denied");
            return;
        } else {

            req.params.userId = (payload as Payload)._id;
            next();
        }
    });
}

export {register, login, logout, refresh};


