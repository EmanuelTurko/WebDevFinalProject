import mongoose from 'mongoose';


export interface Post {
    title:string,
    content:string,
    likes:number,
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
        type: Number,
        default: 0,
    },
});

const postModel = mongoose.model<Post>('posts', postSchema);
export default postModel;