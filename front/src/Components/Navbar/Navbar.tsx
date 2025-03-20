import { FC, useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import formStyle from './Form.module.css';
import PopUpModel from './PopUpModel/PopUpModel';
import CreatePost from './CreatePost';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import blankAvatar from '../../assets/blankAvatar.webp';
import { useUserContext } from '../Context/UserContext';
import {useLikedPostsFilter} from '../Context/LikedFilterContext';
import useUser from '../../Hooks/useUser';
import {useMyPostsFilter} from "../Context/MyPostsFilterContext";
import Logo from '../../assets/Logo.png';

const Navbar: FC = () => {
    const { user, setUser } = useUserContext();
    const { toggleLikedFilter } = useLikedPostsFilter();
    const { toggleMyPostsFilter } = useMyPostsFilter();
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | null>(null);
    const [isModelVisible, setModelVisible] = useState<boolean>(false);
    const [activeModel, setActiveModel] = useState<'CREATE' | 'LOGIN' | 'REGISTER' | null>(null);
    const [flag, setFlag] = useState<boolean>(false);

    const [userData, error] = useUser(user?.username);

    useEffect(() => {
        if (userData) {
            if (userData.imageUrl) setImageUrl(userData.imageUrl);
            if (userData.username) setUsername(userData.username);
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, [userData]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.username !== user?.username) {
            setUser(storedUser);
        }
    }, [user?.username, setUser]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const modelType = (type: 'CREATE' | 'LOGIN' | 'REGISTER') => {
        setActiveModel(type);
        setModelVisible(true);
    };

    const imageSrc = imageUrl || blankAvatar;

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLogo}>
                <img src={Logo} alt="Website Logo" className={styles.logo}/>
            </div>
            <div className={styles.navbarLinks}>
                <a className={`${styles.navLink} ${styles.navLinkHover}`} onClick={() => modelType('CREATE')}>
                    🎨 Create
                </a>

                <PopUpModel isVisible={isModelVisible} onClose={() => setModelVisible(false)}>
                    <div
                        className={`${formStyle.formContainer} ${activeModel === 'LOGIN' ? formStyle.pushLeft : formStyle.pushRight}`}>
                        {activeModel === 'CREATE' && <CreatePost onClose={() => setModelVisible(false)}/>}
                        {activeModel === 'LOGIN' && <LoginForm openRegister={() => modelType('REGISTER')}/>}
                        {activeModel === 'REGISTER' && <RegisterForm openLogin={() => modelType('LOGIN')}/>}
                    </div>
                </PopUpModel>

                <a
                    className={`${styles.navLink} ${styles.navLinkHover}`}
                    onClick={toggleLikedFilter}
                >
                    💌 Liked Posts
                </a>
                <a
                    className={`${styles.navLink} ${styles.navLinkHover}`}
                    onClick={toggleMyPostsFilter}
                >
                    ✉️ My Posts
                </a>

                {flag ? (
                    <a className={`${styles.navLink} ${styles.navLinkHover}`} href="/logout">
                        📤 Logout
                    </a>
                ) : (
                    <>
                        <a className={`${styles.navLink} ${styles.navLinkHover}`} onClick={() => modelType('REGISTER')}>
                            📭 Register
                        </a>
                        <a className={`${styles.navLink} ${styles.navLinkHover}`} onClick={() => modelType('LOGIN')}>
                            📬 Login
                        </a>
                    </>
                )}
                <a className={`${styles.navLink} ${styles.navLinkHover}`} href="/front/public">
                    🎂 Home
                </a>
                <a className={styles.navbarProfile} href="/profile">
                    <img
                        key={imageSrc}
                        src={imageSrc}
                        alt="Profile Avatar"
                    />
                    <span>{username}</span>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;