import React, { useState, useEffect } from "react";
import { useCommerceContext, useFirebaseContext } from "../../context/index";
import firebase from "firebase/app";

//@ts-ignore
import { Link, useLocation } from "react-router-dom";

import { FaCartPlus } from "react-icons/fa";
import refresh from "../../assets/icons/refresh.png";

import "./styles.css";

const Header = () => {
  const auth = firebase.auth();
  const location = useLocation();
  //@ts-ignore
  const { commerce, refreshCart } = useCommerceContext();
  //@ts-ignore
  const { currentUser } = useFirebaseContext();
  const [cartLength, setCartLength] = useState(0);

  const signOut = async () => {
    await auth
      .signOut()
      .then((res) => console.log("signed out", res))
      .catch((err) => console.log("could not sign out", err));
  };

  const retrieveCart = async () => {
    await commerce.cart
      .retrieve()
      .then((cart: { line_items: string | any[] }) => {
        if (cart.line_items.length !== cartLength) {
          retrieveCart();
        }
        setCartLength(cart.line_items.length);
      })
      .catch((err: any) => console.log("error ", err));
  };

  if (location.pathname === "/cart") {
    return (
      <div className="headerContainer">
        <div className="brandContainer">
          <p className="brandName">Some shop</p>
        </div>
        <div className="rightContainer">
          <button className="refreshBtnClicker" onClick={() => refreshCart()}>
            <img src={refresh} className="refreshbtn" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="headerContainer">
      <div className="brandContainer">
        <p className="brandName">Some shop</p>
      </div>
      <div className="rightContainer">
        <div className="cartIconContainer">
          <Link to="cart" className="link">
            <div className="cartButton">
              <FaCartPlus className="cartIcon" />
              <p className="cartLength">{cartLength}</p>
            </div>
          </Link>
        </div>
        {currentUser ? (
          <button className="button authButton" onClick={() => signOut()}>
            Log out
          </button>
        ) : (
          <Link to="/login" className="link">
            <div className="authContainer">
              <button className="button authButton">Login</button>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
