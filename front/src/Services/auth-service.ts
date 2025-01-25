import apiClient,{CanceledError} from './api-client';
import {User} from './Interface/User';

export {CanceledError}
const register = (user: User | undefined) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/register',user,{signal:abortController.signal})
    return {request, abort: () => abortController.abort()}
}
export default {register}