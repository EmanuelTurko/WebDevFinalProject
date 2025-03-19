import { RefreshProvider } from './Components/Context/RefreshContext.tsx';
import { UserProvider } from './Components/Context/UserContext.tsx';
import { LikedFilterProvider } from './Components/Context/LikedFilterContext.tsx';
import { MyPostsFilterProvider } from './Components/Context/MyPostsFilterContext.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostList from './Components/PostList/PostList';
import MainPage from './Components/MainPage/MainPage.tsx';
import Logout from './Components/Logout/Logout';
import Profile from './Components/Profile/Profile.tsx';
import './App.css';
import { useEffect, useState } from 'react';
import { useUserContext } from './Components/Context/UserContext.tsx';
import useUserDetails from './Hooks/useUserDetails';
import PostDetailsPage from "./Components/PostDetailsPage/PostDetailsPage.tsx";

function App() {
    const [flag, setFlag] = useState<boolean>(true);
    const username = localStorage.getItem('username');
    const { setUser } = useUserContext();
    const [userDetails] = useUserDetails(username);

    useEffect(() => {
        if (userDetails) {
            setUser(userDetails);
        }
    }, [userDetails, setUser]);

    useEffect(() => {
        if (username) {
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, [flag, username]);

    return (
        <UserProvider>
            <RefreshProvider>
                <LikedFilterProvider>
                    <MyPostsFilterProvider>
                        <Router>
                            <Routes>
                                <Route path="/posts" element={<PostList />} />
                                <Route path="/" element={<MainPage />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route
                                    path="/profile"
                                    element={flag ? <Profile /> : <Navigate to="/" />}
                                />
                                <Route path="/post/:postId" element={<PostDetailsPage />} /> {/* route for comments for a specific post */}
                                <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        </Router>
                    </MyPostsFilterProvider>
                </LikedFilterProvider>
            </RefreshProvider>
        </UserProvider>
    );
}
//TODO: improve css
//TODO: Make the remember me checkbox work
//TODO: add register via google and facebook

export default App;
