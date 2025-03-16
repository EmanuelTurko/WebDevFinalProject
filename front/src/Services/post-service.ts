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
const likePost = (postId: string | undefined, userId? : string, accessToken?:string | null) => {
    const abortController = new AbortController()
    const request = apiClient
        .put<Post>(`/posts/${postId}/like`,{_id: userId},{
            headers:{
                Authorization: `JWT ${accessToken}`
            },
            signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
const LikedPosts = (username:string)=> {
    const abortController = new AbortController()
    const request = apiClient
        .get<Post[]>(`/posts`,{
            params: {filter: JSON.stringify({likes: username})},
            signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
const getMyPosts = (username:string)=> {
    const abortController = new AbortController()
    const request = apiClient.get<Post[]>(`/posts`,{
        params: {owner: username},
        signal:abortController.signal})
    return {request, abort: () => abortController.abort()
    }
}
const getPostById = (postId:string|undefined)=> {
    const abortController = new AbortController()
    const request = apiClient
        .get<Post>(`/posts/${postId}`,{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}

export default {getAllPosts,likePost,createPost,LikedPosts,getPostById,getMyPosts}