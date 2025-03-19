import { createContext, useContext, useState, ReactNode } from "react";
import { User } from '../../Services/Interface/User';

interface UserContextType {
    user: User | null;
    setUser: (newUser: User | null) => void;
    updateUserField: <K extends keyof User>(field: K, value: User[K]) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    updateUserField: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    // Update the entire user object
    const updateUser = (newUser: User | null) => {
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
            console.log("User updated in localStorage and context:", newUser);
        } else {
            localStorage.removeItem("user");
            console.log("User removed from localStorage and context");
        }
        setUser(newUser);
    };

    const updateUserField = <K extends keyof User>(field: K, value: User[K]) => {
        if (user) {
            const updatedUser = { ...user, [field]: value };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log(`User field "${field}" updated in localStorage and context:`, updatedUser);
            setUser(updatedUser);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, updateUserField }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);