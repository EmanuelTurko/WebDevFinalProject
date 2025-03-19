import { ChangeEvent, FC, FormEvent, useEffect, useState, useRef } from "react";
import styles from "./ProfileForm.module.css";
import useUserDetails from "../../Hooks/useUserDetails.ts";
import uploadImage from "../../Services/uploadImage.ts";
import useUpdateUserDetails from "../../Hooks/useUpdateUserDetails.ts";
import { useUserContext } from "../Context/UserContext.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const ProfileForm: FC = () => {
    const { user, updateUserField } = useUserContext();
    const storedUsername = user?.username || "";

    const [newUsername, setNewUsername] = useState<string | "">(storedUsername || "");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [userDetails] = useUserDetails(storedUsername || null);
    const { updateUser, loading, error, success } = useUpdateUserDetails();

    useEffect(() => {
        if (userDetails) {
            setNewUsername(userDetails.username || "");
            if (userDetails.imageUrl) {
                setImagePreview(userDetails.imageUrl);
            }
        }
    }, [userDetails]);

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewUsername(e.target.value);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            alert("Username cannot be empty");
            return;
        }
        let updatedImageUrl = userDetails?.imageUrl || "";
        if (newImage) {
            try {
                updatedImageUrl = await uploadImage(newImage, storedUsername || "");
            } catch (err) {
                console.error("Error uploading image:", err);
                alert("Failed to upload image");
                return;
            }
        }
        const updateResult = await updateUser(storedUsername, newUsername, updatedImageUrl);
        if (updateResult) {
            if (newUsername !== user?.username) {
                updateUserField("username", newUsername);
            }
            if (newImage) {
                updateUserField("imageUrl", updatedImageUrl);
            }
        }
    };

    return (
        <div className={styles.profileFormContainer}>
            <form className={styles.profileFormCard} onSubmit={handleSubmit}>
                <div className={styles.avatarContainer}>
                    {imagePreview && (
                        <img src={imagePreview} alt="Profile Avatar" className={styles.avatar} />
                    )}
                    <div className={styles.userInfo}>
                        <div className={styles.username}>{newUsername}</div>
                    </div>
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Username</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={handleUsernameChange}
                        className={styles.cardText}
                        placeholder="Username"
                    />
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={userDetails?.email || ""}
                        disabled
                        className={styles.cardText}
                    />
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Likes</label>
                    <input
                        type="number"
                        placeholder="Likes"
                        value={userDetails?.likesCount || 0}
                        disabled
                        className={styles.cardText}
                    />
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Posts</label>
                    <input
                        type="number"
                        placeholder="Posts"
                        value={userDetails?.posts?.length || 0}
                        disabled
                        className={styles.cardText}
                    />
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Comments</label>
                    <input
                        type="number"
                        placeholder="Comments"
                        value={userDetails?.comments?.length || 0}
                        disabled
                        className={styles.cardText}
                    />
                </div>

                <div className={styles.fieldContainer}>
                    <label className={styles.label}>Upload Image</label>
                    <div className={styles.iconContainer}>
                        <FontAwesomeIcon
                            icon={faImage}
                            className={styles.uploadIcon}
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload Profile Picture"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.inputFile}
                            ref={fileInputRef}
                        />
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>

                {success && <div className={styles.successMessage}>Profile updated successfully!</div>}
                {error && <div className={styles.errorMessage}>{error}</div>}
            </form>
        </div>
    );
};

export default ProfileForm;