import React, {createContext, useContext, useEffect, useState} from 'react'
import Commerce from '@chec/commerce.js';


import {auth} from '../firebase/index'

const CommerceContext = createContext()

const FirebaseContext = createContext(null);

export const Context = (props) => {
    const commerce = new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY, true);
    return (
        <CommerceContext.Provider value={{commerce}}>
            {props.children}
        </CommerceContext.Provider>
    )
}

export const FirebaseContextFunc = (props) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(()=>{
        auth.onAuthStateChanged(userAuth => setCurrentUser(userAuth) )
    }, [auth])
    return (
        <FirebaseContext.Provider value={{currentUser}}>
            {props.children}
        </FirebaseContext.Provider>
    )
}



export const useCommerceContext = () => useContext(CommerceContext)
export const useFirebaseContext = () => useContext(FirebaseContext)





