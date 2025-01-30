import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginForm from './Components/LoginForm/LoginForm'
import PostList from './Components/PostList/PostList'
import MainPage from './Components/MainPage/MainPage.tsx'
import './App.css'

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path='/login' element={<LoginForm/>}/>
                <Route path='/posts' element={<PostList/>}/>
                <Route path='/' element={<MainPage/>}/>
            </Routes>
        </Router>
    </>
  )
}

export default App
