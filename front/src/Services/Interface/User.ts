export interface User{
    _id?: string,
    username:string,
    email?:string,
    password:string,
    accessToken?:string,
    refreshToken?:string[],
    posts?:string[],
    comments?:string[],
    likedPosts?:string[],
    likesCount?:number,
    imageUrl?:string | null,
}