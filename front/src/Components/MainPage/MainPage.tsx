import  {FC} from 'react';
import PostList from '../PostList/PostList';
import Navbar from '../Navbar/Navbar';
import styles from './MainPage.module.css';
import RecipeOfTheDay from "../Context/AiPromptService/RecipePrompt.tsx";

const MainPage:FC = () => {
    return (
        <>
        <header>
                <Navbar />
            </header>
            <main className={styles.mainContent}>
                <RecipeOfTheDay />
                <PostList />
            </main>
        </>
    );
};

export default MainPage;