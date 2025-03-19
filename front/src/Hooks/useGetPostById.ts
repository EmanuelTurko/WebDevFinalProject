import { useState, useEffect } from 'react';
import postService, { CanceledError } from '../Services/post-service';
import { Post } from '../Services/Interface/Post';

const useGetPostsById = (postId: string | undefined) => {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            setIsLoading(false);
            setError('Post not found');
            return;
        }
        setIsLoading(true);
        setError(null);
        const { request, abort } = postService.getPostById(postId);
        request
            .then((response) => {
                setPost(response.data);
                setError(null);
            })
            .catch((err) => {
                if (err instanceof CanceledError) {
                    console.log('Request was aborted');
                } else {
                    setError(err.message || 'Failed to fetch post');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => abort();
    }, [postId]);

    return { post, isLoading, error };
};

export default useGetPostsById;