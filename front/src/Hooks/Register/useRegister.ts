import { useState } from 'react';
import authService, { CanceledError } from "../../Services/auth-service.ts";
import { User } from "../../Services/Interface/User.ts";

const useRegister = () => {
    const [error, setError] = useState<string | unknown>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const registerUser = async (user: User) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { request } = authService.register(user);
            const res = await request;

            setUser(res.data);
            console.log(res.status);
        } catch (error) {
            if (!(error instanceof CanceledError)) {
                setError(error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return { user, setUser, error, setError, registerUser, isSubmitting , setIsSubmitting};
};

export default useRegister;