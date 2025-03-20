import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import PostDetail from "../PostDetail/PostDetail";
import styles from './PostDetailsPage.module.css';
import CommentsList from "../PostDetail/CommentsList";
import CommentForm from "../PostDetail/CommentForm";

const PostDetailsPage: FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [refreshKey, setRefreshKey] = useState(0);

    if (!postId) {
        return <div>Post ID is required</div>;
    }

    const handleCommentPosted = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className={styles.postDetailsPage}>
                <div className={styles.postAndCommentsContainer}>
                    <PostDetail postId={postId} />
                    <div className={styles.commentsCard}>
                        <CommentsList postId={postId} refreshKey={refreshKey} />
                    </div>
                </div>
                <div className={styles.commentFormContainer}>
                    <CommentForm
                        postId={postId}
                        onCommentPosted={handleCommentPosted}
                    />
                </div>
            </main>
        </>
    );
};

export default PostDetailsPage;
