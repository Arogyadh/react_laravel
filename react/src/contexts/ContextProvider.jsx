// Import necessary functions from the React library
import { createContext, useContext, useState } from "react";

// Create a new context object called StateContext
// and initialize it with default values for user, token, and setter functions
const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setNotification: () => {},
    setUser: () => {},
    setToken: () => {},
});

// Define a functional component called ContextProvider
// This component will act as the provider for the StateContext
export const ContextProvider = ({ children }) => {
    // Create a state variable 'user' and a function 'setUser' to update it

    const [user, setUser] = useState({});

    const [notification, _setNotification] = useState("");

    const setNotification = (notification) => {
        _setNotification(notification);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    // Create a state variable 'token' and a function '_setToken' to update it
    // Initialize 'token' with the value of 'ACCESS_TOKEN' from the browser's local storage
    // If 'ACCESS_TOKEN' doesn't exist in local storage, 'token' will be initialized as null
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

    // Define a function 'setToken' that takes a 'token' parameter
    const setToken = (token) => {
        // Call the '_setToken' function to update the 'token' state variable
        _setToken(token);

        // If the 'token' parameter is truthy (not null, undefined, empty string, 0, or false)
        if (token) {
            // Store the 'token' value in the browser's local storage
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            // If the 'token' parameter is falsy, remove the 'ACCESS_TOKEN' from local storage
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // Render the StateContext.Provider component and provide the values for
    // user, token, setUser, and setToken to all the child components wrapped inside it
    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

// Define a custom hook called useStateContext
// This hook will allow any component to access the values from the StateContext
export const useStateContext = () => useContext(StateContext);
