import {UserProvider} from './Components/UserContext'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import PostList from './Components/PostList/PostList'
import MainPage from './Components/MainPage/MainPage.tsx'
import Logout from './Components/Logout/Logout'
import './App.css'
import Profile from "./Components/Profile/Profile.tsx";
import {useEffect, useState} from "react";

function App() {
    const [flag, setFlag] = useState<boolean>(true);
        const username = localStorage.getItem('username');
    useEffect(()=>{
        if(username){
            setFlag(true);
        } else{
            setFlag(false);
        }
    },[flag, username])
  return (
    <UserProvider>
        <Router>
            <Routes>
                <Route path='/posts' element={<PostList/>}/>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='/profile' element={flag ? <Profile/> : <Navigate to='/'/>}/>
                <Route path={'/profile'} element=<Profile/>/>
            </Routes>
        </Router>
    </UserProvider>
  )
}

export default App
