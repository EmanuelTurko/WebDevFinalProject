import {FC, useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import styles from './RegisterForm.module.css';
import blankAvatar from '../../assets/blankAvatar.webp';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import {registerSchema} from './RegisterSchema';
import useRegister from '../../Hooks/useRegister.ts';
import {User} from "../../Services/Interface/User.ts";
import uploadImage from "../../Services/uploadImage.ts";
import {useNavigate} from 'react-router-dom';


type userFormData = z.infer<typeof registerSchema>;
const RegisterForm:FC = () => {
    const navigate = useNavigate();
    const {register,handleSubmit, formState:{errors}, watch}
        = useForm<userFormData>({resolver:zodResolver(registerSchema)});

    const [imageUrl] = watch(['imageUrl']);
    const [file,setFile] = useState<File | null>(null);
    const inputFileRef:{current: HTMLInputElement | null} = { current : null};
    const {registerUser} = useRegister();


    useEffect(()=>{
        if(imageUrl){
           setFile(imageUrl[0]);
        }
    },[imageUrl])

    const onFormSubmit = async (data:userFormData) => {
        const user:User = {
            username : data.username,
            email : data.email,
            password:data.password,
            imageUrl:'',
        }
        if(data.imageUrl){
            user.imageUrl = await uploadImage(data.imageUrl[0],data.username);
            if(!user.imageUrl){
                return;
            }
        }
        await registerUser(user);
        navigate('/');
    }
    const {ref,...rest} = register('imageUrl');

    return (
        <div className={styles.main}>
            <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
                <div className={styles.avatarDiv}>
                   <img src={file ? URL.createObjectURL(file) : blankAvatar} alt='' className={styles.avatar}/>
                <FontAwesomeIcon onClick={()=>{inputFileRef.current?.click()}}
                                 icon={faImage} size='2x' className={styles.avatarIcon}/>
                </div>

                    <input {...rest} ref={(e)=>
                    {ref(e); inputFileRef.current = e}}
                           className={styles.inputFile} type="file" accept={'image/png ,image/jpeg'}/>

                <div className={styles.formUsername}>
                    <input {...register('username')}
                           type="text"
                           className={styles.formControl} placeholder="Username"/>
                    {errors.username && <p className={styles.textDanger}>{errors.username.message}</p>}
                </div>
                <div  className={styles.formEmail}>
                    <input {...register('email')}
                        type="email" className={styles.formControl} placeholder="Email"/>
                    {errors.email && <p className={styles.textDanger}>{errors.email.message}</p>}
                </div>
                <div  className={styles.formPassword}>
                    <input {...register('password')}
                           type="password" className={styles.formControl} placeholder="Password"/>
                    {errors.password && <p className={styles.textDanger}>{errors.password.message}</p>}
                </div>
                <div className={styles.formButton}>
                    <button className={'btn btn-primary'} type="submit" >Register</button>
                </div>
                <div className={styles.loginRef}>
                    <label>Already on X? </label> <a href="/login">Sign in</a>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm;