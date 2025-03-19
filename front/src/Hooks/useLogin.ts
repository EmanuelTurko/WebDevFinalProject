import { User } from "../Services/Interface/User.ts";
import authService, { CanceledError } from "../Services/auth-service.ts";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "../Services/api-client.ts";

interface LoginData {
    username: string;
    password: string;
    rememberMe?: boolean;
}

const useLogin = () => {
    const abortControllerRef = useRef<() => void>(() => {});
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        try {
            const response = await apiClient.post('/auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            return accessToken;
        } catch (error) {
            console.error("Refresh token failed", error);
            return null;
        }
    };

    const loginUser = async (loginData: LoginData) => {
        try {
            const { request, abort } =await authService.login(loginData);
            abortControllerRef.current = abort;
            const res = await request;
            setUser(res.data);
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken));
                localStorage.setItem('username', res.data.username);
                if (loginData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
            }

            return { success: true, user: res.data };
        } catch (error) {
            if (error instanceof CanceledError) {
                return { success: false, error: "Request was cancelled" };
            }
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data;
                if (error.response?.status === 401) {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        return loginUser(loginData);
                    }
                }
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "An unknown error occurred" };
        }
    };

    return { user, setUser, error, setError, loginUser };
};

export default useLogin;
