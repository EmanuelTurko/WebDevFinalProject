import mongoose from 'mongoose';

export interface User{
    username:string,
    email:string,
    password:string,
    accessToken?:string,
    refreshToken?:string[],
    posts?:string[],
    comments?:string[],
    likes?:string[],
}
const userSchema = new mongoose.Schema<User>({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,contains:'@',
        unique:true,

    },
    password:{
        type:String,
        required:true,minlength:6,
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
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts',
    }],
})
const userModel = mongoose.model<User>('users', userSchema);
export default userModel;