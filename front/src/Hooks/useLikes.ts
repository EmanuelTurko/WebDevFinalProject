import { useState } from "react";
import postService from "../Services/post-service"; // Ensure correct import

const useLikes = (postId: string | undefined) => {
  const [likesCount, setLikesCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleClick = async () => {
        if(!postId || isLoading) return;
        setIsLoading(true);

        try{
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const accessToken = localStorage.getItem('accessToken');
            if(!user._id || accessToken) throw new Error('User not found in local storage');

            const {request} = postService.likePost(postId, user._id, accessToken);
            const res = await request;
            console.log(res)
            setLikesCount(1)
        } catch (error){
            console.error(error);

        } finally {
            setIsLoading(false);
        }
    }
    return {likesCount, isLoading, handleClick};
}
export default useLikes