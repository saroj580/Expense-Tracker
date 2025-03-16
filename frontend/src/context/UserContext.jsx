import React, { createContext, useEffect, useState} from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage when the app starts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Persist user data
    };

    //function to clear user data (e.g. on lagout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user"); // Remove user data on logout
    };

    return (
        <UserContext.Provider
            value = {{
                user,
                updateUser,
                clearUser
            }}
        >
           {children} 
        </UserContext.Provider>
    )
}

export default UserProvider;