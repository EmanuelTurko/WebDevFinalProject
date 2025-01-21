import {_Controller} from "./_controller";
import commentModel, {Comment} from '../models/comment_model';
import {Request, Response} from "express";
import postModel from "../models/post_model";

class CommentController extends _Controller<Comment>{
    constructor(){
        super(commentModel);
    }
    async like(req:Request,res:Response) {
        try{
            const {id} = req.params;
            const user = req.body.userId;
            const comment = await commentModel.findById(id);
            if(!comment){
                res.status(404).send('Post not found');
                return;
            }

            const isLiked = comment.likes.includes(user);
            if(isLiked){
                comment.likes = comment.likes.filter((id) => id !== user);
                comment.likesCount -= 1;
            } else {
                comment.likes.push(user);
                comment.likesCount += 1;
            }
            await comment.save();
            res.status(200).send(comment);
            return;
        } catch(err:any){
            res.status(400).send({error: err.message});
            return;
        }
    }
}
export default new CommentController();