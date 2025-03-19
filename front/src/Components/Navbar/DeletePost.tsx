import React from 'react';
import styles from './DeletePost.module.css';
import PopUpModel from './PopUpModel/PopUpModel';

interface DeletePostProps {
    onClose: () => void;
    onConfirm: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({ onClose, onConfirm }) => {
    return (
        <PopUpModel isVisible={true} onClose={onClose}>
            <div className={styles.deletePostContainer}>
                <h2>Are you sure you want to delete this post?</h2>
                <p>This action cannot be undone.</p>
                <div className={styles.buttonContainer}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Delete
                    </button>
                </div>
            </div>
        </PopUpModel>
    );
};

export default DeletePost;