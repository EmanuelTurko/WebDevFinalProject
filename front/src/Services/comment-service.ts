import apiClient,{CanceledError} from "./api-client";
import {Comment} from "./Interface/Comment";

export {CanceledError}
const getComments = (postId: string | undefined) => {
    const abortController = new AbortController()
    const request = apiClient
        .get<Comment[]>(`/posts/${postId}/comments`,{
            params: {postId},
            signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
const createComment = (content:string,postId:string|undefined, accessToken: string | null) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<Comment>(`/posts/${postId}/comments`,
            {
                content: content,
                postId: postId
            },
            {
                headers: {
                    Authorization: `JWT ${accessToken}`
                },
                signal: abortController.signal
            });
    return {request, abort: () => abortController.abort()}
}
const likeComment = (postId: string | undefined, commentId: string | undefined, userId?: string, accessToken?: string | null) => {
    if (!postId || !commentId || !userId || !accessToken) {
        throw new Error('Missing required parameters');
    }

    const abortController = new AbortController();
    const request = apiClient
        .put<Comment>(`/posts/${postId}/comments/${commentId}/like`, { username: userId }, {
            headers: {
                Authorization: `JWT ${accessToken}`,
                'Content-Type': 'application/json',
            },
            signal: abortController.signal,
        });
    return { request, abort: () => abortController.abort() };
};
export default{getComments,createComment,likeComment}