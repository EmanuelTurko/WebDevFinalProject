import  { FC } from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";

const userSchema = z.object({
    username: z.string()
        .min(3,("Username must be at least 3 characters long"))
        .max(30),
    email: z.string()
        .refine(
            (email) => /\S+@\S+\.\S+/.test(email),
            { message: "Invalid email format" }
        ),
    password: z.string()
        .min(6,("Password must be at least 6 characters long"))
        .max(30)
        .refine(
            (password) => /[A-Z]/.test(password),
            { message: "Password must contain at least one uppercase letter" }
        ),
});
type userFormData = z.infer<typeof userSchema>;
const Form:FC = () => {
    const {register,handleSubmit, formState:{errors}}
        = useForm<userFormData>({resolver:zodResolver(userSchema)});

    const onSubmit = (data:userFormData) => {
        console.log(data);
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='username' className='form-label'>Name:</label>
                    <input {...register('username')}
                           type="text"
                        className="form-control" placeholder="Enter your name"/>
                           {errors.username && <p className="text-danger">{errors.username.message}</p>}
                </div>
                <div>
                    <label htmlFor='email' className='form-label'>Email:</label>
                    <input {...register('email')}
                        type="email" className="form-control" placeholder="Enter your email"/>
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor='password' className='form-label'>Password:</label>
                    <input {...register('password')}
                        type="password" className="form-control" placeholder="Enter your password"/>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Form;