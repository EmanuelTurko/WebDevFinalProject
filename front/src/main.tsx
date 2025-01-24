import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import RegisterForm from './Components/RegisterForm'

import PostList from './Components/PostList/PostList.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PostList/>

    </StrictMode>,
)
