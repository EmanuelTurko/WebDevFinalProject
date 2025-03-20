import {_Controller} from "./_controller";
import commentModel, {Comment} from '../models/comment_model';
import {Request, Response} from "express";
import userModel from "../models/user_model";

class CommentController extends _Controller<Comment>{
    constructor(){
        super(commentModel);
    }
    async create(req:Request,res:Response){
        try {
            const userId = req.params.userId;
            if(!userId){
                res.status(404).send("UserId not found");
                return
            }
            const user = await userModel.findById(userId);
            if(!user) {
                res.status(404).send("User not found");
                return;
            }
            const commentData = {
                ...req.body,
                owner: user.username,
            };
            const comment = await this.model.create(commentData);
            const savedComment = await comment.save();
            await userModel.findByIdAndUpdate(userId, {
                $push: {
                    comments: savedComment._id
                }});
            res.status(201).send(savedComment);
        } catch(err:any){
            res.status(401).send({error: err.message});
        }
    }
    async like(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const username = req.body.username;
            const user = await userModel.find({ username: username });
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            const comment = await commentModel.findById(id);
            if (!comment) {
                res.status(404).send('Comment not found');
                return;
            }
            const commentOwner = await userModel.findOne({ username: comment.owner });
            if (!commentOwner) {
                res.status(404).send('Owner not found');
                return;
            }
            if (commentOwner.likesCount === undefined) {
                commentOwner.likesCount = 0;
            }
            const isLiked = comment.likes.includes(username);
            if (isLiked) {
                comment.likes = comment.likes.filter((username) => username !== username);
                comment.likesCount -= 1;
                commentOwner.likesCount -= 1;
            } else {
                comment.likes.push(username);
                comment.likesCount += 1;
                commentOwner.likesCount += 1;
            }
            await commentOwner.save();
            await comment.save();
            res.status(200).send(comment);
            return;

        } catch (err: any) {
            res.status(400).send({ error: err.message });
            return;
        }
    }
}
export default new CommentController();