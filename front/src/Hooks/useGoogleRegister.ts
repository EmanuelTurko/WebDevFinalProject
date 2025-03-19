import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { googleRegister } from "../Services/auth-service"; // Update the import path
import {User} from "../Services/Interface/User";


export const useGoogleSignIn = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        setError(null);

        try {
            const { request } = googleRegister(credentialResponse);

            const response = await request;
                setUser(response.data);
                console.log("Google sign-in successful:", response.data);

        } catch (err) {
            if(err instanceof Error)
            setError(err.message);
            console.error("Google sign-in failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, signInWithGoogle };
};
export default useGoogleSignIn;
