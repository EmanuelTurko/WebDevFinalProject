import React, { useState } from 'react';
import useCreatePost from '../../Hooks/useCreatePost';
import styles from './CreatePost.module.css';
import uploadImage from '../../Services/uploadImage';
import {useRefresh} from '../Context/RefreshContext.tsx';

interface CreatePostProps {
    onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
    const { triggerRefresh } = useRefresh();
    const [text, setText] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const { isLoading, error, createPost } = useCreatePost();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        if (!accessToken) {
            throw new Error("No access token found");
        }

        try {
            let uploadedImageUrl: string | undefined;
            if (file) {
                uploadedImageUrl = await uploadImage(file, username);
            }
            await createPost(text, accessToken, uploadedImageUrl);
            console.log("refresh...");
            triggerRefresh();
            return true;
        } catch (error) {
            console.error("Error uploading image or creating post:", error);
            throw error;
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
                    .then(() => {
                        onClose();
                    })
                    .catch((error) => {
                        console.error("Error creating post:", error);
                    });
            }}
            className={styles.formContainer}
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className={styles.textarea}
            />

            <label htmlFor="file-upload" className={styles.uploadArea}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded Preview" className={styles.imagePreview} />
                ) : (
                    <span className={styles.uploadText}>Upload Image</span>
                )}
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.uploadButton}
                />
            </label>

            {imageUrl && <img src={imageUrl} alt="Preview" className={styles.hidden} />}
            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                {isLoading ? 'Sharing...' : 'Share Post'}
            </button>

            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default CreatePost;