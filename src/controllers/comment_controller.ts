import {_Controller} from "./_controller";
import commentModel, {Comment} from '../models/comment_model';

class CommentController extends _Controller<Comment>{
    constructor(){
        super(commentModel);
    }
}
export default new CommentController();