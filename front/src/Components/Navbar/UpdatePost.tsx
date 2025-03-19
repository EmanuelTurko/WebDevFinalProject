import React, { useState, useEffect } from 'react';
import useUpdatePost from '../../Hooks/useUpdatePost';
import styles from './CreatePost.module.css';
import uploadImage from '../../Services/uploadImage';
import { useRefresh } from '../Context/RefreshContext.tsx';

interface UpdatePostProps {
    onClose: () => void;
    postToEdit: {
        _id: string|undefined;
        content: {
            text: string;
            imageUrl?: string;
        };
    };
}

const UpdatePost: React.FC<UpdatePostProps> = ({ onClose, postToEdit }) => {
    const { triggerRefresh } = useRefresh();
    const [text, setText] = useState<string>(postToEdit.content.text);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(postToEdit.content.imageUrl || '');

    const { isLoading, error, updatePost } = useUpdatePost();

    useEffect(() => {
        setText(postToEdit.content.text);
        setImageUrl(postToEdit.content.imageUrl || '');
    }, [postToEdit]);

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
            const updatedData = {
                content: {
                    text: text,
                    imageUrl: uploadedImageUrl || postToEdit.content.imageUrl,
                },
            };
            await updatePost(postToEdit._id, updatedData, accessToken);

            console.log("refresh...");
            triggerRefresh();
            return true;
        } catch (error) {
            console.error("Error uploading image or updating post:", error);
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
                        console.error("Error updating post:", error);
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
                {isLoading ? 'Updating...' : 'Update Post'}
            </button>

            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default UpdatePost;