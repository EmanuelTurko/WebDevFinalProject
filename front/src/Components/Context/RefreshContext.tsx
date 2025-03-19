import { createContext, useContext, useState, ReactNode } from 'react';

interface RefreshContextType {
    refreshKey: number;
    triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType>({
    refreshKey: 0,
    triggerRefresh: () => {},
});

export const useRefresh = () => useContext(RefreshContext);

interface RefreshProviderProps {
    children: ReactNode;
}

export const RefreshProvider = ({ children }: RefreshProviderProps) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};