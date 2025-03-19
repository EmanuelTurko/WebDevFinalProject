import {useEffect, useState} from 'react';
import { User } from "../Services/Interface/User.ts";
import {fetchUserDetails} from '../Services/user-service.ts';
import {CanceledError} from "axios";
import { AxiosError } from "axios";

const useUserDetails = (username: string | null) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        if(!username) {
            return;
        }

        const { request, abort } = fetchUserDetails(username);
        request
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                if (error instanceof CanceledError) {
                    return;
                } else if (error instanceof AxiosError) {
                    if (error.response) {
                        console.error("Error fetching user details:", error.response.status, error.response.data);
                    } else if (error.request) {
                        console.error("No response received:", error.request);
                    } else {
                        console.error("Request setup error:", error.message);
                    }
                } else {
                    console.error("Unexpected error type:", error);
                }
            });
        console.log(username);
        return () => abort();
    }, [username]);

    return [user];
};
export default useUserDetails;
