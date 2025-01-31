export interface Post {
    content:Content,
    owner:string,
    likes?:string[],
    likesCount?:number,
    _id?:string,
}
export interface Content{
    text:string,
    imageUrl?:string,
    createdAt:Date,
    updatedAt:Date,
}