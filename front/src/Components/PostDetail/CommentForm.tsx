import React, { FC, useState } from "react";
import useCreateComment from "../../Hooks/useCreateComment";
import styles from './CommentForm.module.css';

interface CommentFormProps {
    postId: string;
    onCommentPosted: () => void;
}

const CommentForm: FC<CommentFormProps> = ({ postId, onCommentPosted }) => {
    const [comment, setComment] = useState("");
    const { createComment, isLoading, error } = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("User is not authenticated.");
                }
                await createComment(comment, postId, accessToken);
                setComment("");
                onCommentPosted();
            } catch (err) {
                console.error("Error posting comment:", err);
            }
        }
    };
    return (
        <form className={styles.commentForm} onSubmit={handleSubmit}>
            <textarea
                className={styles.commentTextarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={4}
            />
            <button type="submit" className={styles.postButton} disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
    );
};

export default CommentForm;