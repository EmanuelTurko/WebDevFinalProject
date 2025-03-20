import PostService, { CanceledError } from '../Services/post-service';
import { useState } from 'react';
import { useRefresh } from '../Components/Context/RefreshContext';

const useDeletePost = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {triggerRefresh } = useRefresh();


    const deletePost = async (postId: string|undefined, accessToken: string|undefined) => {
        setIsLoading(true);
        const { request, abort } = PostService.deletePost(postId, accessToken);

        try {
            await request;
            setIsLoading(false);
            triggerRefresh();
        }catch (error) {
            if (error instanceof CanceledError) {
                console.log('Request was aborted');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            setIsLoading(false);
        }
        return () => abort();
    };
    return { deletePost, isLoading, error };
};

export default useDeletePost;
