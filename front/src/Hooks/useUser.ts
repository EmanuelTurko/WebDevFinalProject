import { useEffect, useState } from 'react';
import { User } from "../Services/Interface/User";
import { fetchUser, CanceledError } from '../Services/user-service';

const useUser = (username: string | null | undefined): [User | null, string | null] => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token || !username) {
            return;
        }

        const { request, abort } = fetchUser(username, token);

        request
            .then((response) => {
                setUser(response.data);
                setError(null);
            })
            .catch((error) => {
                if (error instanceof CanceledError) {
                    console.log("error", error);
                } else {
                    setError(error.message);
                }
            });
        return () => {
            abort();
        };
    }, [username]);

    return [user, error];
};

export default useUser;