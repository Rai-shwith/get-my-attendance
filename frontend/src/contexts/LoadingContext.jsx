import { Children, createContext, useContext, useState } from "react";
import LoadingBar from "../components/LoadingBar";

export const loadingContext = createContext(false);

export const LoadingProvider = ({children}) => {
    const [loading, setLoading] = useState(false);

    return (
        <loadingContext.Provider value={{loading,setLoading}}>
            <LoadingBar />
            {children}
        </loadingContext.Provider>
    )
};

export const useLoading = () => useContext(loadingContext);