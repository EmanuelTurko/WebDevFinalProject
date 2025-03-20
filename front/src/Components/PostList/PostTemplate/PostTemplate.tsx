import { FC, useEffect, useState } from "react";
import { Post } from "../../../Services/Interface/Post";
import { formatDistanceToNow } from "date-fns";
import styles from "./PostTemplate.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as regularComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faPencil as solidPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash as solidTrash } from '@fortawesome/free-solid-svg-icons';
import useUserDetails from '../../../Hooks/useUserDetails';
import useDeletePost from '../../../Hooks/useDeletePost';
import postService from "../../../Services/post-service";
import { useRefresh } from "../../Context/RefreshContext";
import { useUserContext } from "../../Context/UserContext";
import useGetComments from '../../../Hooks/useGetComments';
import { Link } from 'react-router-dom';
import PopUpModel from '../../Navbar/PopUpModel/PopUpModel';
import UpdatePost from '../../Navbar/UpdatePost';
import DeletePost from '../../Navbar/DeletePost';

const PostTemplate: FC<{ post: Post }> = ({ post }) => {
    const { triggerRefresh } = useRefresh();
    const { user, updateUserField } = useUserContext();
    const { deletePost } = useDeletePost();
    const [isUpdated, setIsUpdated] = useState(false);
    const [postUser] = useUserDetails(post.owner);
    const [likes, setLikes] = useState<string[] | undefined>(post.likes);
    const [liked, setLiked] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [lastCommentOwner, setLastCommentOwner] = useState<string | null>(null);
    const [lastCommentContent, setLastCommentContent] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { comments, isLoading, error } = useGetComments(post._id, refreshKey);

    useEffect(() => {
        if (!user) return;

        const userLikedPost = post.likes?.includes(user.username) || false;
        setLiked(userLikedPost);

        localStorage.setItem(`liked-${post._id}`, userLikedPost.toString());
    }, [post.likes, post._id, user]);

    useEffect(() => {
        if (post.updatedAt !== post.createdAt) {
            setIsUpdated(true);
        }

        if (comments && comments.length > 0) {
            const lastMatchingComment = comments
                .filter((comment) => comment.postId === post._id)
                .pop();
            if (lastMatchingComment) {
                setLastCommentContent(lastMatchingComment.content);
                setLastCommentOwner(lastMatchingComment.owner);
            } else {
                setLastCommentContent('No comments yet');
                setLastCommentOwner(null);
            }
        }
    }, [comments, post.updatedAt, post.createdAt, post._id]);

    const formatDate = (date: Date, isUpdated: boolean) => {
        const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
        return isUpdated ? `updated ${timeAgo}` : `posted ${timeAgo}`;
    };

    const formatLikes = (postLikes: string[] | undefined) => {
        if (!postLikes || postLikes.length === 0) {
            return;
        }
        if (postLikes.length === 1) {
            return `Liked by ${postLikes[0]}`;
        }
        return `Liked by ${postLikes[0]} and ${postLikes.length - 1} others`;
    };

    const handleLikeClick = async (postId: string | undefined) => {
        if (!user) return;

        try {
            const { request } = postService.likePost(postId, user._id, user.accessToken);
            const response = await request;
            updateUserField('likesCount', response.data.likesCount || 0);
            setLikes((prevLikes) => {
                let updatedLikes = [...(prevLikes || [])];
                if (!prevLikes?.includes(user.username)) {
                    updatedLikes.push(user.username);
                    setLiked(true);
                    localStorage.setItem(`liked-${postId}`, 'true');
                } else {
                    updatedLikes = updatedLikes.filter((username) => username !== user.username);
                    setLiked(false);
                    localStorage.setItem(`liked-${postId}`, 'false');
                }
                return updatedLikes;
            });
            setRefreshKey((prevKey) => prevKey + 1);
            triggerRefresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deletePost(post._id, user?.accessToken);
            triggerRefresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="card">
            <div className={styles.avatarContainer}>
                <img
                    src={postUser?.imageUrl || 'http://localhost:3000/blankAvatar.webp'}
                    alt="User Avatar"
                    className={styles.avatar}
                />
                <div>
                    <div className={styles.userName}>{postUser?.username || post.owner}</div>
                    <div className={styles.postedAt}>
                        {formatDate(post.createdAt, false)}
                        {isUpdated && `, ${formatDate(post.updatedAt, true)}`}
                    </div>
                </div>
                {user && post.owner === user.username && (
                    <div className={styles.postActions}>
                        <FontAwesomeIcon
                            icon={solidPencil}
                            size="lg"
                            onClick={handleEditClick}
                            className={styles.actionIcon}
                        />
                        <FontAwesomeIcon
                            icon={solidTrash}
                            size="lg"
                            onClick={handleDeleteClick}
                            className={styles.actionIcon}
                        />
                    </div>
                )}
            </div>

            <div className={styles.contentContainer}>
                <p className={styles.cardText}>{post.content.text}</p>
                {post.content.imageUrl && (
                    <img
                        src={post.content.imageUrl}
                        alt="Post content"
                        className={styles.cardImg}
                    />
                )}
            </div>

            <div className={styles.likesCommentsContainer}>
                <FontAwesomeIcon
                    icon={liked ? solidHeart : regularHeart}
                    size="2x"
                    onClick={() => handleLikeClick(post._id)}
                    className={`${styles.heartIcon} ${liked ? styles.liked : styles.notLiked}`}
                />
                <Link to={`/post/${post._id}`}>
                    <FontAwesomeIcon
                        icon={regularComment}
                        size="2x"
                        className={styles.avatarIcon}
                        style={{ cursor: "pointer", fontSize: "24px" }}
                    />
                </Link>
            </div>

            <div className={styles.likedByContainer}>
                {formatLikes(likes)}
            </div>

            {isLoading && <p>Loading comments...</p>}
            {error && <p>Error: {error}</p>}
            {lastCommentContent && (
                <div className={styles.likesCommentsContainer}>
                    {lastCommentOwner ? (
                        <span>
                            <strong>{lastCommentOwner}</strong> {lastCommentContent}
                        </span>
                    ) : (
                        <span>{lastCommentContent}</span>
                    )}
                </div>
            )}
            {comments && comments.length > 0 ? (
                <span className={styles.likesCommentsContainer}>
                    <Link to={`/post/${post._id}`}>
                        View all {comments.length} comments
                    </Link>
                </span>
            ) : (
                <span className={styles.likesCommentsContainer}>
                    <Link to={`/post/${post._id}`}>
                        Be the first to comment
                    </Link>
                </span>
            )}

            <PopUpModel isVisible={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <UpdatePost
                    onClose={() => setIsEditModalOpen(false)}
                    postToEdit={{
                        _id: post._id,
                        content: {
                            text: post.content.text,
                            imageUrl: post.content.imageUrl,
                        },
                    }}
                />
            </PopUpModel>

            <PopUpModel isVisible={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <DeletePost
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            </PopUpModel>
        </div>
    );
};

export default PostTemplate;