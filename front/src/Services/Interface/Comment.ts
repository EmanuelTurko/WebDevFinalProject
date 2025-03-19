export interface Comment{
    content:string,
    owner:string,
    postId?:string,
    likes?:string[],
    likesCount?:number,
    _id?:string,
    createdAt?:Date,
    updatedAt?:Date,


}