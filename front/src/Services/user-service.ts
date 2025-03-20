import apiClient,{CanceledError} from './api-client';
import {User} from './Interface/User';

export {CanceledError}
export const fetchUser = (username: string, accessToken:string | null) => {
    const abortController = new AbortController()
    const request = apiClient
        .get<User>(`/users/${username}` ,{
            headers:{
        Authorization: `JWT ${accessToken}`
    }, signal:abortController.signal
        });
    return {request, abort: () => abortController.abort()}
}
export const fetchUserDetails = (username: string) => {
    const abortController = new AbortController()
    const request = apiClient
        .get<User>(`/users/${username}` ,{signal:abortController.signal});
    return {request, abort: () => abortController.abort()}
}
export const updateUserDetails = (currentUsername: string | null, newUsername: string | null, imageUrl: string | null) => {
    const abortController = new AbortController();
    const payload = { currentUsername, newUsername, imageUrl };
    const request = apiClient.put<User>(`/users/${currentUsername}`, payload, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};
