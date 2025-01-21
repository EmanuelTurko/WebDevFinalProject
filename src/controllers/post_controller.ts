import {_Controller}from './_controller';
import postModel,{Post} from '../models/post_model';
import {Request, Response} from "express";

class PostController extends _Controller<Post>{
    constructor() {
        super(postModel);
    }
    async like(req:Request,res:Response) {
       try{
       const {id} = req.params;
       const user = req.body.userId;
       const post = await postModel.findById(id);
       if(!post){
              res.status(404).send('Post not found');
              return;
       }

       const isLiked = post.likes.includes(user);
       if(isLiked){
           post.likes = post.likes.filter((id) => id !== user);
           post.likesCount -= 1;
       } else {
           post.likes.push(user);
           post.likesCount += 1;
       }
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