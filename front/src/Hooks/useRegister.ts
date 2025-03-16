import { useRef, useState } from 'react';
import authService, { CanceledError } from "../Services/auth-service.ts";
import { RegisterData } from "../Services/Interface/RegisterData.ts";

const useRegister = () => {
    const [error, setError] = useState<string | unknown>(null);
    const abortControllerRef = useRef<() => void>(() => {});

    const registerUser = async (user: RegisterData) => {
        try {
            const { request, abort } = authService.register(user);
            abortControllerRef.current = abort;
            const res = await request;
            return { success: true, data: res.data }; // Return the response data
        } catch (error) {
            if (!(error instanceof CanceledError)) {
                setError(error);
                return { success: false, error }; // Return the error
            }
        } finally {
            abortControllerRef.current(); // Abort the request
        }
    };

    return { error, setError, registerUser }; // Remove user and setUser
};

export default useRegister;