import {FC, useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import styles from './RegisterForm.module.css';
import fromStyle from '../Navbar/Form.module.css';
import blankAvatar from '../../assets/blankAvatar.webp';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import {registerSchema} from './RegisterSchema';
import useRegister from '../../Hooks/useRegister';
import {RegisterData} from "../../Services/Interface/RegisterData";
import uploadImage from "../../Services/uploadImage";
import {useNavigate} from 'react-router-dom';
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import useLogin from "../../Hooks/useLogin";
import useGoogleSignIn from "../../Hooks/useGoogleRegister";


interface RegisterFormProps{
    openLogin: () => void;
}
type userFormData = z.infer<typeof registerSchema>;
const RegisterForm:FC<RegisterFormProps> = ({openLogin}) => {
    const navigate = useNavigate();
    const {register,handleSubmit, formState:{errors}, watch}
        = useForm<userFormData>({resolver:zodResolver(registerSchema)});
    const [imageUrl] = watch(['imageUrl']);
    const [file,setFile] = useState<File | null>(null);
    const inputFileRef:{current: HTMLInputElement | null} = { current : null};
    const {registerUser} = useRegister();
    const {user,signInWithGoogle} = useGoogleSignIn();
    const {loginUser} = useLogin();


    useEffect(()=>{
        if(imageUrl){
           setFile(imageUrl[0]);
        }
    },[imageUrl])
    useEffect(() => {
        if (user) {
            console.log("User is set:", user);
            const LoginData = {
                username: user.username,
                password: user.password,
            };

            loginUser(LoginData)
                .then(() => {
                    console.log("Google login successful");
                    localStorage.setItem('user', JSON.stringify(user));

                    window.location.reload();
                    navigate('/');
                })
                .catch((error:unknown) => {
                    if(error instanceof Error){
                        console.error("Google login failed:", error);
                    }
                    else{
                        console.error(error);
                    }
                }
                );
        }
    }, [user]);

    const onFormSubmit = async (data: userFormData) => {
        const user: RegisterData = {
            username: data.username,
            email: data.email,
            password: data.password,
            imageUrl: '',
        };
        if (data.imageUrl && data.imageUrl[0]) {
            try {
                user.imageUrl = await uploadImage(data.imageUrl[0], data.username);
            } catch (error) {
                console.error("Failed to upload image:", error);
            }
        }
        const response = await registerUser(user);
        if (response?.success) {
            const res = await loginUser({username: data.username, password: data.password});
            if(res?.success){
                console.log("register normally")
                localStorage.setItem('user', JSON.stringify(res?.user));
                window.location.reload();
                navigate('/');
            }
        } else {
            console.error("Registration failed:", response?.error);
        }
    };
    const {ref,...rest} = register('imageUrl');

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        await signInWithGoogle(credentialResponse);

    };
    const onGoogleLoginFailure = () => {
        console.log("google login failed");

    }

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.formContainer} ${fromStyle.registerForm}`}>
                <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
                    <div className={styles.avatarDiv}>
                        <img src={file ? URL.createObjectURL(file) : blankAvatar} alt='' className={styles.avatar}/>
                        <FontAwesomeIcon onClick={() => {
                            inputFileRef.current?.click()
                        }}
                                         icon={faImage} size='2x' className={styles.avatarIcon}/>
                    </div>

                    <input {...rest} ref={(e) => {
                        ref(e);
                        inputFileRef.current = e
                    }}
                           className={styles.inputFile} type="file" accept={'image/png ,image/jpeg'}/>

                    <div className={styles.formUsername}>
                        <input {...register('username')}
                               type="text"
                               className={styles.formControl} placeholder="Username"/>
                        {errors.username && <p className={styles.textDanger}>{errors.username.message}</p>}
                    </div>
                    <div className={styles.formEmail}>
                        <input {...register('email')}
                               type="email" className={styles.formControl} placeholder="Email"/>
                        {errors.email && <p className={styles.textDanger}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.formPassword}>
                        <input {...register('password')}
                               type="password" className={styles.formControl} placeholder="Password"/>
                        {errors.password && <p className={styles.textDanger}>{errors.password.message}</p>}
                    </div>
                    <button className={styles.formButton} type="submit">Register</button>
                    <div className={styles.googleLoginWrapper}>
                        <GoogleLogin
                            onSuccess={onGoogleLoginSuccess}
                            onError={onGoogleLoginFailure}
                            containerProps={{ className: styles.googleButton }}
                        />
                    </div>
                    <div className={styles.loginRef}>
                        <label>Already on X? </label>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            openLogin();
                        }}>Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm;