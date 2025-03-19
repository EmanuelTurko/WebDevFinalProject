import { useEffect, useState } from 'react';
import CommentService, { CanceledError } from '../Services/comment-service';
import { Comment } from '../Services/Interface/Comment';
import { AxiosError } from 'axios';

const useGetComments = (postId: string | undefined, refreshKey: number) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) return;
        const { request, abort } = CommentService.getComments(postId);
        setIsLoading(true);
        request
            .then((response) => {
                setComments(response.data);
                setError(null);
            })
            .catch((err) => {
                if (err instanceof CanceledError) {
                    console.log('Request was aborted');
                } else {
                    console.error('Error fetching comments:', err);
                    setError((err as AxiosError).message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => abort();
    }, [postId, refreshKey]);

    return { comments, isLoading, error };
};

export default useGetComments;