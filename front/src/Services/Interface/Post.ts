export interface Post {
    content:Content,
    owner:string,
    likes?:string[],
    likesCount?:number,
    _id?:string,
    createdAt:Date,
    updatedAt:Date,
}
export interface Content{
    text:string,
    imageUrl?:string,
}