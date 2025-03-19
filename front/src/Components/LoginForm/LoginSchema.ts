import {z} from "zod";

const loginSchema = z.object({
    username: z.string().min(3,("Username is required")).max(30),
    password: z.string()
        .min(6,("Password is required"))
        .max(30)
    ,
    rememberMe: z.boolean().optional()

});
export {loginSchema};