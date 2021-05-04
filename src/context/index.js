import React, {createContext, useContext, useEffect, useState} from 'react'
import Commerce from '@chec/commerce.js';


const CommerceContext = createContext()

const index = (props) => {
    const commerce = new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY);
    const {cart, products, categories } = commerce

    const value = {
        cart, products, categories
    }
    return (
        <CommerceContext.Provider value={value}>
            {props.children}
        </CommerceContext.Provider>
    )
}

export default index
export const useCommerceContext = () => useContext(CommerceContext)



