import { FC } from 'react';
import usePosts from '../../Hooks/usePosts.ts';
import PostTemplate from './postTemplate/postTemplate.tsx';
import styles from './postList.module.css';

const PostList: FC = () => {
    const { posts, isLoading, error } = usePosts();

    return (
        <div className={styles.postListContainer}>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {posts.map((post) => (
                <div key={post._id} className={styles.card}>
                    <PostTemplate post={post} />
                </div>
            ))}
        </div>
    );
};

export default PostList;