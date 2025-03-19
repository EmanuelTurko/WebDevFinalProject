import { createContext, useContext, useState, FC, ReactNode } from 'react';

interface FilterContextTypeMyPosts {
    showMyPostsOnly: boolean;
    toggleMyPostsFilter: () => void;
}

const MyPostsFilterContext = createContext<FilterContextTypeMyPosts>({
    showMyPostsOnly: false,
    toggleMyPostsFilter: () => {},
});

export const useMyPostsFilter = () => useContext(MyPostsFilterContext);

export const MyPostsFilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [showMyPostsOnly, setShowMyPostsOnly] = useState<boolean>(false);

    const toggleMyPostsFilter = () => {
        setShowMyPostsOnly((prev) => !prev);
    };

    return (
        <MyPostsFilterContext.Provider value={{ showMyPostsOnly, toggleMyPostsFilter }}>
            {children}
        </MyPostsFilterContext.Provider>
    );
};
