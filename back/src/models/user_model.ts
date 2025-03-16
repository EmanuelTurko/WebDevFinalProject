import mongoose from 'mongoose';

export interface User{
    _id?: mongoose.Schema.Types.ObjectId,
    username:string,
    email:string,
    password:string,
    accessToken?:string,
    refreshToken?:string[],
    posts?:mongoose.Types.ObjectId[],
    comments?:mongoose.Types.ObjectId[],
    likedPosts?:string[],
    likesCount?:number,
    imageUrl?:string,
}
const userSchema = new mongoose.Schema<User>({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: /.+@.+\..+/

    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
   accessToken:{
        type:String,
       default:null,
    },
    refreshToken:{
        type:[String],
        default:[],
   },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts',
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comments',
    }],
    likedPosts:[{
        type:String,
        ref:'posts',
    }],
    likesCount:{
        type:Number,
        default:0,
    },
    imageUrl:{
        type:String,
        default: `http://localhost:3000/blankAvatar.webp`,
    }
})
const userModel = mongoose.model<User>('users', userSchema);
export default userModel;