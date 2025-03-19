import apiClient,{CanceledError} from './api-client';
import {User} from './Interface/User';
import {LoginData} from './Interface/LoginData';
import {RegisterData} from './Interface/RegisterData';
import {CredentialResponse} from "@react-oauth/google";

export {CanceledError}
const register = (user: RegisterData ) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/register',user,{signal:abortController.signal})

    return {request, abort: () => abortController.abort()}
}
export const googleRegister = (credentialResponse:CredentialResponse ) => {
    const abortController = new AbortController()
    const request = apiClient
        .post<User>('/auth/google',credentialResponse,{signal:abortController.signal})

    return {request, abort: () => abortController.abort()}
}
export const login =async (loginData: LoginData) => {
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

export default {register,login,logout};