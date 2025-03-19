// Hooks/useGetPosts.ts
import { useState, useEffect } from 'react';
import postService, { CanceledError } from '../Services/post-service';
import { Post } from '../Services/Interface/Post';

const useGetPosts = (refreshKey: number) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPosts = () => {
            setIsLoading(true);
            const { request, abort } = postService.getAllPosts();
            request
                .then((res) => {
                    const sortedPosts = res.data.sort((a: Post, b: Post) => {
                        return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    });
                    setPosts(sortedPosts);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (!(error instanceof CanceledError)) {
                        setError(error.message);
                    }
                });

            return abort;
        };

        const abort = fetchPosts();
        return () => abort();
    }, [refreshKey]);

    return { posts, setPosts, isLoading, error, setError, setIsLoading };
};

export default useGetPosts;