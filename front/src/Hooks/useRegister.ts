import {useRef, useState} from 'react';
import authService, { CanceledError } from "../Services/auth-service.ts";
import { User } from "../Services/Interface/User.ts";

const useRegister = () => {
    const [error, setError] = useState<string | unknown>(null);
    const [user, setUser] = useState<User | null>(null);
    const abortControllerRef = useRef<() => void>(() => {});
    const registerUser= async (user: User) => {
        try {
            const {request, abort} = authService.register(user);
            abortControllerRef.current = abort;
            const res = await request;
            setUser(res.data);
        } catch (error) {
            if (!(error instanceof CanceledError)) {
                setError(error);
            }
        } finally{
            abortControllerRef.current();
        }
    };

    return { user, setUser, error, setError, registerUser};
};

export default useRegister;