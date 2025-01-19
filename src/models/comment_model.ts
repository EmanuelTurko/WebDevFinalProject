import mongoose from 'mongoose';

export interface Comment{
    content:string,
    owner:string,
    post:string,
    likes:number,
}
const commentSchema = new mongoose.Schema<Comment>({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    }
});
const commentModel = mongoose.model<Comment>('comments', commentSchema);
export default commentModel;