import apiClient,{CanceledError} from './api-client';
import {User} from './Interface/User';

export {CanceledError}
const register = (user: User | undefined) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/register',user,{signal:abortController.signal})
    console.log('registering:...',request)

    return {request, abort: () => abortController.abort()}
}
const login = (user: User | undefined) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/login',user,{signal:abortController.signal})
    console.log('login:...',request)

    return {request, abort: () => abortController.abort()}
}

export default {register,login}