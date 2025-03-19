import { FC } from "react";
import useGetComments from "../../Hooks/useGetComments.ts";
import styles from './CommentsList.module.css';
import CommentTemplate from "./CommentTemplate.tsx"; 

interface CommentsListProps {
    postId: string; 
    refreshKey: number;
    updateUserField?: (field: string, value: number) => void;
    setRefreshKey?: (key: (prevKey: number) => number) => void;
}

const CommentsList: FC<CommentsListProps> = ({ postId, refreshKey, updateUserField, setRefreshKey }) => {
    const { comments, isLoading, error } = useGetComments(postId, refreshKey);
    const currentUser = localStorage.getItem('username') || ''; 

    return (
        <div className={styles.commentsContainer}>
            {isLoading && <p>Loading comments...</p>}
            {error && <p>Error loading comments: {error}</p>}
            <ul className={styles.commentsList}>
                {comments?.length > 0 ? (
                    comments.map((comment) => (
                        <CommentTemplate
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            currentUser={currentUser}
                            updateUserField={updateUserField}
                            setRefreshKey={setRefreshKey}
                        />
                    ))
                ) : (
                    <p className={styles.noCommentsMessage}>No comments yet.</p>
                )}
            </ul>
        </div>
    );
};
export default CommentsList;