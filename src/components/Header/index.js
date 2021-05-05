import React from 'react'

import { FaCartPlus } from 'react-icons/fa';


const index = () => {
    return (
        <div className="headerContainer">
            <div><button>CommerceShop</button></div>
            <div>
                <div>
                <button><FaCartPlus/></button>
                </div>
                <div>
                <button>Login</button>
                </div>
            </div>
        </div>
    )
}

export default index
