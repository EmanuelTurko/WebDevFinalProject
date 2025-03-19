import authService from "../Services/auth-service.ts";
import { CanceledError } from "../Services/auth-service.ts";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";

const useLogout = () => {
    const [error, setError] = useState<string | null>(null);

    const logout = useCallback(async (refreshToken: string[]) => {
        try {
            const { request } = authService.logout(refreshToken);
            await request;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('rememberMe');

            setError(null);
        } catch (error) {
            if (error instanceof CanceledError) {
                return;
            } else if (error instanceof AxiosError) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }, []);

    return { error, logout };
};

export default useLogout;