import React, { createContext, useReducer } from "react"

export const AuthContext = createContext({})

const initialState = {
    isAuthenticated: false,
    logoutJasWindowOpened: false
}

const authReducer = (state, { type, payload }) => {
    switch (type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true
            }
        case 'LOGIN_FAIL':
            return {
                ...state,
                isAuthenticated: false
            }
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                isAuthenticated: false
            }
        case 'OPEN_LOGOUT_JAS_WINDOW':          
            return {
                ...state,
                logoutJasWindowOpened: true
            }
        case 'CLOSE_LOGOUT_JAS_WINDOW':
            return {
                ...state,
                logoutJasWindowOpened: false
            }    
        default:
            return state
    }
}

export const AuthProvider = ({ children }) => {
    const [authState, authDispatch] = useReducer(
        authReducer,
        initialState
    );

    const { isAuthenticated, logoutJasWindowOpened } = authState;

    const loginSuccess = payload =>
        authDispatch({
            type: "LOGIN_SUCCESS",
            payload
        })
    
    const loginFail = payload => 
        authDispatch({
            type: "LOGIN_FAIL",
            payload
        })    
        
    const logoutSuccess = payload =>
        authDispatch({
            type: "LOGOUT_SUCCESS",
            payload
        })

    const openLogoutJasWindow = payload =>
        authDispatch({
            type: "OPEN_LOGOUT_JAS_WINDOW",
            payload
        })

    const closeLogoutJasWindow = payload =>
        authDispatch({
            type: "CLOSE_LOGOUT_JAS_WINDOW",
            payload
        })

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            logoutJasWindowOpened,
            loginSuccess, 
            loginFail, 
            logoutSuccess, 
            openLogoutJasWindow, 
            closeLogoutJasWindow 
        }}>
            {children}
        </AuthContext.Provider>
    )
}