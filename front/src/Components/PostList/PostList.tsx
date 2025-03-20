import { FC, useState } from 'react';
import useGetPosts from '../../Hooks/useGetPosts';
import PostTemplate from './PostTemplate/PostTemplate';
import { useLikedPostsFilter } from '../Context/LikedFilterContext';
import { useMyPostsFilter } from '../Context/MyPostsFilterContext';
import styles from './PostList.module.css';
import { useRefresh } from "../Context/RefreshContext";

const PostList: FC = () => {
    const { refreshKey } = useRefresh();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 10;
    const { posts, isLoading, error } = useGetPosts(refreshKey);
    const { showLikedOnly } = useLikedPostsFilter();
    const { showMyPostsOnly } = useMyPostsFilter();

    const currentUser = localStorage.getItem('username') || '';

    const filteredLikedPosts = showLikedOnly
        ? posts.filter((post) => post.likes?.includes(currentUser))
        : posts;

    const filteredPosts = showMyPostsOnly
        ? filteredLikedPosts.filter((post) => post.owner === currentUser)
        : filteredLikedPosts;

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const pageNumbers = [
        currentPage - 1 > 0 ? currentPage - 1 : null,
        currentPage,
        currentPage + 1 <= totalPages ? currentPage + 1 : null
    ].filter((page) => page !== null);

    return (
        <div className={styles.postListContainer}>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((post) => (
                <div key={post._id} className={styles.card}>
                    <PostTemplate post={post} />
                </div>
            ))}
            <div className={styles.pagination}>
                <button
                    className={styles.arrowButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ←
                </button>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className={styles.arrowButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default PostList;
