import { FC, useState, useEffect } from "react";
import useUserDetails from "../../Hooks/useUserDetails";
import styles from './CommentsList.module.css';
import { Comment } from "../../Services/Interface/Comment";
import { faThumbsUp as ThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentService from "../../Services/comment-service";

interface CommentTemplateProps {
    comment: Comment;
    postId: string;
    currentUser: string;
    updateUserField?: (field: string, value: number) => void;
    setRefreshKey?: (key: (prevKey: number) => number) => void;
}

const CommentTemplate: FC<CommentTemplateProps> = ({ comment, postId, currentUser, updateUserField = () => {}, setRefreshKey = () => {} }) => {
    const [user] = useUserDetails(comment.owner);
    const accessToken = localStorage.getItem("accessToken");
    const [liked, setLiked] = useState<boolean>(false);
    useEffect(() => {
        const likedStatus = localStorage.getItem(`liked-${comment._id}`);
        setLiked(likedStatus === 'true');
    }, [comment._id]);
    const handleLike = async () => {
        if (!currentUser || !postId) return;

        try {
            const { request } = CommentService.likeComment(postId, comment._id, currentUser, accessToken);
            const response = await request;
            if (user) {
                updateUserField('likesCount', response.data.likesCount || 0);
            }
            setLiked((prevLiked) => {
                const newLiked = !prevLiked;
                localStorage.setItem(`liked-${comment._id}`, newLiked.toString());
                return newLiked;
            });
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (error: unknown) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <li className={styles.commentItem}>
            <div className={styles.commentLeftSection}>
                {user && <>
                    <img
                        src={user.imageUrl}
                        alt={`${user.username}'s avatar`}
                        className={styles.commentAvatar}
                    />
                    <p className={styles.commentUsername}>{user.username}</p>
                    <span className={styles.commentStats}>
                        Likes: {user.likesCount} Comments: {user.comments.length || 0}
                    </span>
                    <span className={styles.commentStats}>
                        {comment && comment.updatedAt && (
                            `${new Date(comment.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })} ${new Date(comment.updatedAt).toLocaleDateString()} `
                        )}
                    </span>
                </>}
            </div>
            <div className={styles.commentRightSection}>
                <p className={styles.commentContent}>{comment.content}</p>
            </div>
            <FontAwesomeIcon
                icon={ThumbsUp}
                size="2x"
                className={`${styles.commentActionButton} ${liked ? styles.liked : ""}`}
                onClick={handleLike}
            />
        </li>
    );
};

export default CommentTemplate;