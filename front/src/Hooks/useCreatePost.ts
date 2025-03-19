import {useState} from 'react';
import PostService from '../Services/post-service';
import {CanceledError} from '../Services/post-service';
import {AxiosError} from "axios";

const useCreatePost = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createPost = async (text: string,accessToken:string,imageUrl?:string ) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!accessToken) throw new Error('Invalid Access Token');

            const {request} = PostService.createPost({content:{text: text,imageUrl}},accessToken);
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
    return {isLoading, error, createPost};
}
export default useCreatePost;