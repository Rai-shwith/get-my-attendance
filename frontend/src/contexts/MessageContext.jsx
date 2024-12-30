import { createContext, useContext, useState } from "react";
import { GeneralMessage } from "../components/GeneralMessage"; // This will now handle both types of messages

export const MessageContext = createContext(false);

export const MessageProvider = ({children}) => {
    const [message, setMessage] = useState(""); // This will hold both error and general messages
    const [isError, setIsError] = useState(false); // Flag to determine if the message is an error

    return (
        <MessageContext.Provider value={{message, setMessage, isError, setIsError}}>
            <GeneralMessage message={message} isError={isError} />
            {children}
        </MessageContext.Provider>
    )
};

export const useMessage = () => useContext(MessageContext);