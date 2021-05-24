import React, { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore
import Commerce from "@chec/commerce.js";

import { auth } from "../firebase/index";

// @ts-ignore
const CommerceContext = createContext();

const FirebaseContext = createContext(null);

export const Context = (props: any) => {
  const commerce = new Commerce(
    process.env.REACT_APP_COMMERCEJS_PUBLIC_KEY,
    true
  );
  const refreshCart = async () => {
    await commerce.cart
      .refresh()
      .then((cart: any) => console.log("sucess ", cart))
      .catch((err: any) => console.log(err));
  };

  return (
    <CommerceContext.Provider value={{ commerce, refreshCart }}>
      {props.children}
    </CommerceContext.Provider>
  );
};

export const FirebaseContextFunc = (props: any) => {
  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => setCurrentUser(userAuth));
  }, [auth]);
  return (
    <FirebaseContext.Provider value={{ currentUser }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useCommerceContext = () => useContext(CommerceContext);
export const useFirebaseContext = () => useContext(FirebaseContext);
