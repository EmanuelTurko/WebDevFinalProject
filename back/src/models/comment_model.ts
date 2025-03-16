import mongoose from 'mongoose';

export interface Comment{
    content:string,
    owner:string,
    postId?:string,
    likes:string[],
    likesCount:number,
    createdAt?:Date,
    updatedAt?:Date,
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
    postId: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});
const commentModel = mongoose.model<Comment>('comments', commentSchema);
export default commentModel;