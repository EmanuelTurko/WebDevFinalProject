import { useState } from 'react';
import authService, { CanceledError } from "../../Services/auth-service.ts";
import { User } from "../../Services/Interface/User.ts";

const useRegister = () => {
    const [error, setError] = useState<string | unknown>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const registerUser = async (user: User) => {
        if (isSubmitting) return; // Prevent duplicate submissions while submitting

        setIsSubmitting(true); // Start the submission process
        setError(null); // Reset the error state before the submission

        try {
            const { request } = authService.register(user); // Destructure request and abort from the service
            const res = await request; // Wait for the request to complete

            setUser(res.data); // Store the user data in the state
            console.log(res.status);
        } catch (error) {
            if (!(error instanceof CanceledError)) {
                setError(error); // Handle error if request fails
            }
        } finally {
            setIsSubmitting(false); // Stop submitting state after the process completes
        }
    };

    return { user, setUser, error, setError, registerUser, isSubmitting , setIsSubmitting};
};

export default useRegister;