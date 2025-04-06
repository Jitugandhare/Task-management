import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from "../utils/apiPaths";


export const UserContext = createContext();


const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)


    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data)
        } catch (error) {
            console.error("User is not auathenticated", error)
            clearUser();
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) return;

        const accesstoken = localStorage.getItem("token");
        if (!accesstoken) {
            setLoading(false);
            return
        }
        fetchUser();

    }, [])


    const updatedUser = (userData) => {
        setUser(userData)
        localStorage.setItem("token", userData.token);
        setLoading(false)
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem("token")
    }

    return (
        <UserContext.Provider value={{ user, loading, updatedUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;