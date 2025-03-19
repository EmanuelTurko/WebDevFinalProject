import mongoose from 'mongoose';
import { Request, Response } from 'express';
import userModel from '../models/user_model';
import Post_model from "../models/post_model";

const findUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    if(!username){
        res.status(400).send("username is required");
        return;
    }
    try {
        const user = await userModel.findOne({ username: username })
            .select('-password -accessToken -refreshToken -__v');
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).send(user);
}
    catch (err: any) {
        res.status(401).send({ error: err.message });
    }
};
const updateUser = async (req: Request, res: Response) => {
    const { currentUsername,newUsername, imageUrl } = req.body;
    try{
        const user = await userModel.findOne({ username: currentUsername})
        if(!user){
            res.status(404).send("User not found");
            return;
        }
        if(newUsername) {
            user.username = newUsername;
            await Post_model.updateMany(
                { owner: currentUsername },
                { $set: { owner: newUsername } }
            );
        }
        if(imageUrl) {
            user.imageUrl = imageUrl;
        }
        await user.save();

        res.status(200).send(user);
    } catch(err:any){
        res.status(400).send(err.message);
        return;
    }
};
const userController = { findUser, updateUser };
export default userController;