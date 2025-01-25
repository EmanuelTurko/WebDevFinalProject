import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
//import PostList from './Components/PostList/PostList.tsx'
import RegisterForm from "./Components/RegisterForm/RegisterForm.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RegisterForm/>

    </StrictMode>,
)
