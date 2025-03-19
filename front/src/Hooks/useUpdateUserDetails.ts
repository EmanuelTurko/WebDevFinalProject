import {useEffect, useRef, useState} from "react";
import {updateUserDetails} from "../Services/user-service";
import {CanceledError} from "axios";

const useUpdateUserDetails = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const abortRef = useRef<() => void>();

    const updateUser = async (
        currentUsername: string|null,
        newUsername:string|null,
        imageUrl:string|null) => {
        if (!currentUsername) {
            setError("Username is required");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const {request, abort} = updateUserDetails(currentUsername, newUsername, imageUrl);
            abortRef.current = abort;
            const response = await request;

            if (response.data) {
                setSuccess(true);
                return true;
            } else {
                setError("Failed to update user details");
                return false;
            }
        } catch (err) {
            if (!(err instanceof CanceledError)) {
                setError("An error occurred while updating user details");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (abortRef.current) {
                abortRef.current();
            }
        };
    }, []);
    return { loading, error, success, updateUser };
};

export default useUpdateUserDetails;