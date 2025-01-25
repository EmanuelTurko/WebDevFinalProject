import {z} from "zod";

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
    imageUrl: z.instanceof(FileList).optional()
});

export {userSchema};