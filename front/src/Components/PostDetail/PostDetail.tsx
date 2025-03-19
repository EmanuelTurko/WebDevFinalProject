import { FC } from "react";
import useGetPostsById from "../../Hooks/useGetPostById";
import styles from './PostDetail.module.css';

interface PostDetailProps {
    postId: string;
}

const PostDetail: FC<PostDetailProps> = ({ postId }) => {
    const { post, isLoading, error } = useGetPostsById(postId);

    if (isLoading) {
        return <div>Loading post details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className={styles.postCard}>
            <h1>{post.content.text}</h1>
            <div className={styles.postContent}>
                {post.content.imageUrl && (
                    <img src={post.content.imageUrl} alt="Post content" />
                )}
            </div>
            <p className={styles.postMeta}>
                Posted by <strong>{post.owner}</strong> • {new Date(post.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default PostDetail;