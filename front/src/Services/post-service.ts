import apiClient,{CanceledError} from "./api-client.ts";
import {Post} from "./Interface/Post.ts";

export {CanceledError}
const getAllPosts = ()=> {
    const abortController = new AbortController()
    const request = apiClient
        .get<Post[]>('/posts',{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
const likePost = (postId: string | undefined, userId : string) => {
    const abortController = new AbortController()
    const request = apiClient
        .put<Post>(`/posts/${postId}/like`,{_id: userId},{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}

export default {getAllPosts,likePost}