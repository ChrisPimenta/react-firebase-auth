import React, { useEffect, useState, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { },
})

const calcRemainingTime = (expirationTime) => {
    const currentTimeMS = new Date().getTime();
    const expirationTimeMS = new Date(expirationTime).getTime();

    return expirationTimeMS - currentTimeMS;
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calcRemainingTime(storedExpirationTime);

    // Token expired. Remove it and return null.
    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return { token: null, duration: null };
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = props => {
    const initialTokenObj = retrieveStoredToken();

    const [token, setToken] = useState(initialTokenObj.token);

    const isLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const loginHandler = useCallback((token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calcRemainingTime(expirationTime.toISOString());

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    }, []);

    useEffect(() => {
        if (initialTokenObj.token) {
            console.log('Automatic login: ', initialTokenObj.duration);
            logoutTimer = setTimeout(logoutHandler, initialTokenObj.duration);
        }
    }, [initialTokenObj])

    const contextValue = {
        token,
        isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;