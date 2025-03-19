import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import App from "./App.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="832597213528-aodb6f0qtm3rjqmbj02ajc0nse9qe98u.apps.googleusercontent.com">
    <StrictMode>
        <App/>
    </StrictMode>,
</GoogleOAuthProvider>
)
