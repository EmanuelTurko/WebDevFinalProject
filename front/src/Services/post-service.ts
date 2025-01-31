import apiClient,{CanceledError} from "./api-client.ts";
import {Post} from "./Interface/Post.ts";

export {CanceledError}
const getAllPosts = ()=> {
    const abortController = new AbortController()
    const request = apiClient
        .get<Post[]>('/posts',{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
const createPost = (post: {content: {text:string, imageUrl?:string}}, accessToken:string | null) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<Post>('/posts',
            {
                content: {
                    text: post.content.text,
                    imageUrl: post.content.imageUrl
                }
            },
            {
                headers: {
                    Authorization: `JWT ${accessToken}`
                },
                signal: abortController.signal
            });
    return {request, abort: () => abortController.abort()}
}
const likePost = (postId: string | undefined, userId : string, accessToken:string | null) => {
    const abortController = new AbortController()
    const request = apiClient
        .put<Post>(`/posts/${postId}/like`,{_id: userId},{
            headers:{
                Authorization: `JWT ${accessToken}`
            },
            signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}

export default {getAllPosts,likePost,createPost}