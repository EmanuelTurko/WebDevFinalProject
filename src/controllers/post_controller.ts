import {_Controller}from './_controller';
import postModel,{Post} from '../models/post_model';

class PostController extends _Controller<Post>{
    constructor() {
        super(postModel);
    }

}
export default new PostController();