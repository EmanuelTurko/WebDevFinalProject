import { useEffect, useState } from 'react';
import postService, { CanceledError } from '../Services/post-service';
import { Post } from '../Services/Interface/Post';
import { useRefresh } from '../Components/Context/RefreshContext.tsx';

const useGetLikedPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { refreshKey } = useRefresh();

    useEffect(() => {
        let abort: () => void;

        const fetchLikedPosts = async () => {
            setIsLoading(true);
            const username = localStorage.getItem('username');
            if (!username) {
                setError('User not logged in');
                setIsLoading(false);
                return;
            }
            const { request, abort: abortRequest } = postService.LikedPosts(username);
            abort = abortRequest;
            request
                .then((res) => {
                    setPosts(res.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (!(error instanceof CanceledError)) {
                        setError(error.message);
                    }
                });
        };
        fetchLikedPosts().then(() => {

        });

        return () => {
            if (abort) abort();
        };
    }, [refreshKey]);

    return { posts, isLoading, error };
};

export default useGetLikedPosts;