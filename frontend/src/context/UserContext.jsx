import React, { createContext, useState} from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    //function to clear user data (e.g. on lagout)
    const cleatUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value = {{
                user,
                updateUser,
                cleatUser
            }}
        >
           {children} 
        </UserContext.Provider>
    )
}

export default UserProvider;