import mongoose from 'mongoose';

export interface Content{
    text:string,
    imageUrl?:string,
    createdAt:Date,
    updatedAt:Date,
}
export interface Post {
    content:Content,
    likes:string[],
    likesCount:number,
    owner:string,
}
const postSchema = new mongoose.Schema<Post>({
    content: {
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: null,
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