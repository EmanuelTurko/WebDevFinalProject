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
            return { success: true, data: res.data };
        } catch (error) {
            if (!(error instanceof CanceledError)) {
                setError(error);
                return { success: false, error };
            }
        } finally {
            abortControllerRef.current();
        }
    };

    return { error, setError, registerUser };
};

export default useRegister;