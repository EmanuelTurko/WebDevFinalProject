import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.css';
import fromStyle from '../Navbar/Form.module.css';
import useLogin from '../../Hooks/useLogin';
import { loginSchema } from './LoginSchema';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import blankAvatar from '../../assets/blankAvatar.webp';

interface LoginFormProps {
    openRegister: () => void;
}

export type loginFormData = z.infer<typeof loginSchema>;

const LoginForm: FC<LoginFormProps> = ({ openRegister }) => {
    const { handleSubmit, register, formState: { errors } } = useForm<loginFormData>();
    const { loginUser } = useLogin();
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const rememberMe = localStorage.getItem('rememberMe');
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        if (rememberMe === 'true' && accessToken && username) {
            const autoLogin = async () => {
                try {
                    const response = await loginUser({ username, password: '', rememberMe: true });
                    if (!response?.success) {
                        setLoginError("Automatic login failed. Please log in manually.");
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    if(error instanceof Error) {
                        setLoginError(error.message);
                    }
                }
            };

            autoLogin().then(()=>{});
        }
    }, [loginUser, navigate]);

    const onFormSubmit = async (data: loginFormData) => {
        setLoginError(null);
        const response = await loginUser(data);
        if (!response?.success) {
            setLoginError(response?.error);
        } else {
            localStorage.setItem('user', JSON.stringify(response?.user));
            window.location.reload();
            navigate('/');
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.formContainer} ${fromStyle.loginForm}`}>
                <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
                    <div className={styles.avatarDiv}>
                        <img src={blankAvatar} alt='' className={styles.avatar} />
                    </div>
                    <div>
                        {loginError && <p className={styles.textDanger}>{loginError}</p>}
                    </div>
                    <div className={styles.formUsername}>
                        <input {...register('username')}
                               type="username" className={styles.formControl} placeholder="Username" />
                        {errors.username && <p className={styles.textDanger}>{errors.username.message}</p>}
                    </div>
                    <div className={styles.formPassword}>
                        <input {...register('password')}
                               type="password" className={styles.formControl} placeholder="Password" />
                        {errors.password && <p className={styles.textDanger}>{errors.password.message}</p>}
                    </div>
                    <div className={styles.formRememberMe}>
                        <input {...register('rememberMe')} type='checkbox' className={styles.checkbox} />
                        <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                            Remember me
                        </label>
                    </div>
                    <button type='submit' className={styles.formButton}>Login</button>
                    <div className={styles.loginRef}>
                        <label>Not a member? </label>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            openRegister();
                        }}>Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
