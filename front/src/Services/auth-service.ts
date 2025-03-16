import apiClient,{CanceledError} from './api-client';
import {User} from './Interface/User';
import {LoginData} from './Interface/LoginData';
import {RegisterData} from './Interface/RegisterData';

export {CanceledError}
const register = (user: RegisterData ) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/register',user,{signal:abortController.signal})

    return {request, abort: () => abortController.abort()}
}
const login = (loginData: LoginData) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/login',{
                username: loginData.username,
                password: loginData.password
            }
            ,{signal:abortController.signal})

    return {request, abort: () => abortController.abort()}
}
const logout = (refreshToken:string[]) => {
    const abortController = new AbortController()
    const request  = apiClient
        .post('/auth/logout',{
                refreshToken: refreshToken
            },{
                signal:abortController.signal
            });
    return {request, abort: () => abortController.abort()}
}

export default {register,login,logout}