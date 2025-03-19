import mongoose from 'mongoose';

export interface Content{
    text:string,
    imageUrl?:string,
}
export interface Post {
    content:Content,
    likes:string[],
    likesCount:number,
    owner:string,
}
const postSchema = new mongoose.Schema<Post>(
    {
        content: {
            text: {
                type: String,
                required: true,
            },
            imageUrl: {
                type: String,
                default: null,
            },
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
    },
    { timestamps: true }
);

const postModel = mongoose.model<Post>('posts', postSchema);
export default postModel;