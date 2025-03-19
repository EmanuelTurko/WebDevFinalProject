import {useState} from 'react';
import CommentService from '../Services/comment-service';
import {CanceledError} from '../Services/comment-service';
import {AxiosError} from "axios";

const useCreateComment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createComment = async (text: string,postId:string|undefined,accessToken:string ) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!accessToken) throw new Error('Invalid Access Token');

            const {request} = CommentService.createComment(text,postId,accessToken);
            await request;
        } catch (error: unknown) {
            if(error instanceof CanceledError){
                return;
            } else if(error instanceof AxiosError){
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return {isLoading, error, createComment};
}
export default useCreateComment;