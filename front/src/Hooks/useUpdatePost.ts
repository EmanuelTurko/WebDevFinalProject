import PostService, { CanceledError } from '../Services/post-service';
import { useState } from 'react';
import { useRefresh } from '../Components/Context/RefreshContext';

const useUpdatePost = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { triggerRefresh } = useRefresh();

    const updatePost = async (
        postId: string | undefined,
        updatedData: { content: { text?: string, imageUrl?: string } },
        accessToken: string | null
    ) => {
        if (!postId) {
            setError('Post ID is required');
            return;
        }
        if (!accessToken) {
            setError('Access token is required');
            return;
        }
        if (!updatedData?.content?.text && !updatedData?.content?.imageUrl) {
            setError('No data to update');
            return;
        }
        setIsLoading(true);
        const { request, abort } = PostService.updatePost(postId, updatedData, accessToken);
        try {
            await request;
            triggerRefresh();
        } catch (error) {
            if (error instanceof CanceledError) {
                console.log('Update request was aborted');
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }

        return abort;
    };

    return { updatePost, isLoading, error };
};

export default useUpdatePost;
