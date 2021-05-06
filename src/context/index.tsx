import React, {createContext, useContext} from 'react'
import Commerce from '@chec/commerce.js';


const CommerceContext = createContext()

const Context = (props) => {
    const commerce = new Commerce(process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY, true);

    const value = {
        commerce
    }
    return (
        <CommerceContext.Provider value={value}>
            {props.children}
        </CommerceContext.Provider>
    )
}

export default Context
export const useCommerceContext = () => useContext(CommerceContext)



