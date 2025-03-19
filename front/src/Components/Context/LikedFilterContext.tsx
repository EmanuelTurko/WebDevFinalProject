// Contexts/LikedFilterContext.tsx
import  { createContext, useContext, useState,FC ,ReactNode} from 'react';

interface FilterContextTypeLiked {
    showLikedOnly: boolean;
    toggleLikedFilter: () => void;
}


const LikedFilterContext = createContext<FilterContextTypeLiked>({
    showLikedOnly: false,
    toggleLikedFilter: () => {},
});



export const useLikedPostsFilter = () => useContext(LikedFilterContext);

export const LikedFilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [showLikedOnly, setShowLikedOnly] = useState<boolean>(false);

    const toggleLikedFilter = () => {
        setShowLikedOnly((prev) => !prev);
    };

    return (
        <LikedFilterContext.Provider value={{ showLikedOnly, toggleLikedFilter }}>
            {children}
        </LikedFilterContext.Provider>
    );
};