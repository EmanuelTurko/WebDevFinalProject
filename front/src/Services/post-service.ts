import apiClient,{CanceledError} from "./api-client.ts";
import {Post} from "./Interface/Post.ts";

export {CanceledError}
const getAllPosts = ()=> {
    const abortController = new AbortController()
    const request = apiClient
        .get<Post[]>('/posts',{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}

export default {getAllPosts}