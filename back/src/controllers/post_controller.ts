import {_Controller}from './_controller';
import postModel,{Post} from '../models/post_model';
import {Request, Response} from "express";
import userModel from "../models/user_model";

class PostController extends _Controller<Post>{
    constructor() {
        super(postModel);
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
            const postData = {
                ...req.body,
                owner: user.username,
            };
            const post = await this.model.create(postData);
            const savedPost = await post.save();

            await userModel.findByIdAndUpdate(userId, {
                $push: {
                    posts: savedPost._id,
                }});
            res.status(201).send(savedPost);
        } catch(err:any){
            res.status(401).send({error: err.message});
        }
    }
        async like(req:Request,res:Response) {
           try {
               const {id} = req.params;
               const userId = req.body._id;
               console.log(userId);
               console.log(id);
               const user = await userModel.findById(userId);
               if (!user) {
                   res.status(404).send('User not found');
                   return;
               }
               console.log(user);
           const post = await postModel.findById(id);
           if (!post) {
               res.status(404).send('PostTemplate not found');
               return;
           }
           const postOwner = await userModel.findOne({username: post.owner});
           if (!postOwner) {
               res.status(404).send('Owner not found');
               return;
           }
           if(postOwner.likesCount === undefined){
               postOwner.likesCount = 0
           }
           if(user.likedPosts === undefined){
                user.likedPosts = []
           }

           const isLiked = post.likes.includes(user.username);
           if (isLiked) {
               post.likes = post.likes.filter((username) => username !== user.username);
               post.likesCount -= 1;
               user.likedPosts = user.likedPosts.filter((postId) => postId.toString() !== id);
               console.log("this post was liked");
               console.log(user.likedPosts);
               postOwner.likesCount -= 1;
           } else {
               post.likes.push(user.username);
               post.likesCount += 1;
               user.likedPosts.push(id);
               postOwner.likesCount += 1;

           }
           await user.save();
           await postOwner.save();
           await post.save();
       res.status(200).send(post);
       return;
       } catch(err:any){
              res.status(400).send({error: err.message});
              return;
       }
    }
}
export default new PostController();