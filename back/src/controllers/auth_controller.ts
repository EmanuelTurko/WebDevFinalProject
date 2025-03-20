import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response,NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import {OAuth2Client} from 'google-auth-library';
dotenv.config();

let isSignedThroughGoogle:boolean = false;
const generateTokens = (_id: string): {accessToken: string, refreshToken: string} | null => {
    const rand = Math.floor(Math.random() * 1000000000);
    const token_exp = "15m";
    const ref_token_exp = "7d";
    if (process.env.TOKEN_SECRET === undefined) {
        console.log("Error: TOKEN_SECRET is not defined");
        return null;
    }
    if (process.env.TOKEN_EXP === undefined) {
        console.log("Error: TOKEN_EXP is not defined");
        return null;
    }
    if (process.env.REFRESH_TOKEN_EXP === undefined) {
        console.log("Error: REFRESH_TOKEN_EXP is not defined");
        return null;
    }
    if(process.env.REFRESH_TOKEN_SECRET === undefined){
        console.log("Error: REFRESH_TOKEN_SECRET is not defined");
        return null;
    }
    const accessToken = jwt.sign(
        { _id: _id, rand: rand },
        process.env.TOKEN_SECRET,
        { expiresIn: token_exp },
    );
    const refreshToken = jwt.sign(
        { _id: _id, rand: rand },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: ref_token_exp },
    );
    return { accessToken, refreshToken };
}
const register = async (req: Request, res: Response) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const findUser = await userModel.findOne({ username: username });
    let imageUrl;
    if(req.body.imageUrl){
         imageUrl = req.body.imageUrl;
    } else {
        imageUrl = 'https://'+process.env.DOMAIN_BASE+'/blankAvatar.webp';
    }
    if(!username){
        res.status(400).send("username is required");
        return;
    }
    if(findUser != null){
        res.status(400).send("username already exists");
        return;
    }
    const findEmail = await userModel.findOne({ email: email });
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
            imageUrl: imageUrl,
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
        const user = await userModel.findOne({ username: username });
        if (!user) {
            res.status(401).send("Incorrect username or password");
            return;
        }

        if(!(isSignedThroughGoogle)) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.status(401).send("Incorrect username or password");
                return;
            }
        }

        const tokens = generateTokens(user._id.toString());
        if (!tokens) {
            res.status(401).send("Server error");
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        user.accessToken = tokens.accessToken;
        await user.save();
        isSignedThroughGoogle = false;

        res.status(200).send({
            username: user.username,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (err: any) {
        console.error("Login error:", err.message);
        res.status(401).send(err.message);
    }
}

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("Missing refreshToken");
        return;
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
        res.status(500).send("Server error: TOKEN_SECRET not configured");
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: any, user: any) => {
        if (err) {
            res.status(401).send("Invalid token");
            return;
        }
        const userId = user._id;
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            user.refreshToken = user.refreshToken?.filter(token => token !== refreshToken);
            await user.save();
            res.status(200).send("Logout successful");
        } catch (err:any) {
            res.status(500).send("Internal server error");
        }
    });
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(403).send("Missing refreshToken");
        return;
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
        res.status(403).send("Server error: TOKEN_SECRET not configured");
        return;
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: any, user: any) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }
        const userId = user._id;
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(403).send("Internal error");
                return;
            }
            if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                res.status(402).send("Invalid token");
                return;
            }
            const newTokens = generateTokens(userId);
            if (!newTokens) {
                res.status(403).send("Server error");
                return;
            }
            res.status(200).send({
                accessToken: newTokens.accessToken,
            });
        } catch (err: any) {
            res.status(403).send(err.message);
        }
    });
};
const client = new OAuth2Client();
const googleSignIn = async (req: Request, res: Response) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (!email) {
            res.status(400).send("Invalid email");
            return;
        }
        let user = await userModel.findOne({ email: email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = await userModel.create({
                username: payload?.name,
                email: email,
                password: hashedPassword,
                imageUrl: payload?.picture,
            });
            await user.save();
        }
        const tokens = generateTokens(user._id.toString());
        if (!tokens) {
            res.status(500).send("Token generation failed");
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        user.accessToken = tokens.accessToken;
        await user.save();
        isSignedThroughGoogle = true

        res.status(200).send({
            username: user.username,
            _id: user._id,
            email: user.email,
            password: user.password,
            imageUrl: user.imageUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (err: any) {
        res.status(400).send(err.message);
    }
};


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
            res.status(401).send("Access denied");
            return;
        } else {

            req.params.userId = (payload as Payload)._id;
            next();
        }
    });
}
const authController = {
    register,
    login,
    logout,
    refresh,
    googleSignIn,
}
export default authController;


