import {FC} from "react";
import Navbar from "../Navbar/Navbar.tsx";
import styles from "../MainPage/MainPage.module.css";
import ProfileForm from "./ProfileForm.tsx";


const Profile:FC = () => {

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className={styles.mainContent}>
                <ProfileForm/>
            </main>
        </>
    )
}
export default Profile;