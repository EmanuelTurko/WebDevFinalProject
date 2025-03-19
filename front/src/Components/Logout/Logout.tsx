import { FC, useEffect, useRef } from 'react';
import useLogout from '../../Hooks/useLogout';
import { useNavigate } from 'react-router-dom';

const Logout: FC = () => {
    const { logout, error } = useLogout();
    const navigate = useNavigate();
    const isLoggedOut = useRef(false);

    useEffect(() => {
        if (isLoggedOut.current) return;

        const refreshToken = JSON.parse(localStorage.getItem('refreshToken') || '[]');
        logout(refreshToken).then(() => {
            isLoggedOut.current = true;
            navigate('/');
        });
        return () => {
            isLoggedOut.current = true;
        };
    }, []);

    if (error) {
        return <div>Error logging out: {error}</div>;
    }

    return <div>Logging out...</div>;
};

export default Logout;