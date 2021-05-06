import React from 'react'

import {Link, useLocation} from 'react-router-dom'

import { FaCartPlus } from 'react-icons/fa';
import "./styles.css"


const Header = () => {

    const location = useLocation()
    console.log(location.pathname)


    if(location.pathname === '/cart'){
        return(
            <div className="headerContainer">
            <div className="brandContainer"><p className="brandName">Some shop</p></div>
            </div>
        )
    }


    return (
        <div className="headerContainer">
            <div className="brandContainer"><p className="brandName">Some shop</p></div>
                <div className="rightContainer">
                <div className="cartIconContainer"> 
                <Link to="cart">
                <button  className="button cartButton"><FaCartPlus className="cartIcon"/></button>
                </Link>
                </div>
                <div className="authContainer">
                <button className="button authButton">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Header
