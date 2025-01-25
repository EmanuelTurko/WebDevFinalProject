export interface Post {
    title:string,
    content:string,
    owner:string,
    likes?:string[],
    likesCount?:number,
    _id?:string,
}