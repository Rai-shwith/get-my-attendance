import { Children, createContext, useContext, useState } from "react";
import { ErrorMessage } from "../components/ErrorMessage";

export const ErrorMessageContext = createContext(false);

export const ErrorMessageProvider = ({children}) => {
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <ErrorMessageContext.Provider value={{errorMessage,setErrorMessage}}>
        <ErrorMessage/>
            {children}
        </ErrorMessageContext.Provider>
    )
};

export const useErrorMessage = () => useContext(ErrorMessageContext);