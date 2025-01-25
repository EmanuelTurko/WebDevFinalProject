import mongoose from 'mongoose';

export interface Content{
    text:string,
    imageUrl:string,
    createdAt:Date,
    updatedAt:Date,
}
export interface Post {
    title:string,
    content:Content,
    likes:string[],
    likesCount:number,
    owner:string,
}
const postSchema = new mongoose.Schema<Post>({
    title: {
        type: String,
        required: true,
    },
    content: {
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    owner: {
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
});

const postModel = mongoose.model<Post>('posts', postSchema);
export default postModel;