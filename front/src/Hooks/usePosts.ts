import {useState, useEffect} from 'react'
import postService,{CanceledError} from "../Services/post-service.ts";
import {Post} from "../Services/Interface/Post.ts";

const usePosts = () => {
    const [posts,setPosts] = useState<Post[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(()=>{
        setIsLoading(true)
        const {request,abort} =postService.getAllPosts()
        request.then((res)=>{
            setPosts(res.data)
            setIsLoading(false)
        }).catch((error) => {
            if(!(error instanceof CanceledError)){
                setError(error.message)
            }
        });
        return abort;
    }, [])
    return {posts,setPosts,isLoading,error, setError, setIsLoading}
}

export default usePosts;