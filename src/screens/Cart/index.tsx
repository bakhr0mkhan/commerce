import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
//@ts-ignore
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

import { useCommerceContext, useFirebaseContext } from "../../context/index";
import { Header } from "../../components/index";
import "./styles.css";
import { FaCartPlus } from "react-icons/fa";
import cartLoading from "../../assets/animations/cartLoading.json";
import emptyCartAnimation from "../../assets/animations/emptyCart.json";
import spinner from "../../assets/animations/spinner.json";

const Cart = () => {
  // @ts-ignore
  const { commerce } = useCommerceContext();
  const history = useHistory();
  // @ts-ignore
  const { currentUser } = useFirebaseContext();

  const auth = firebase.auth();

  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(true);
  const [emptyCartArray, setEmptyCartArray] = useState(false);
  const [subtotal, setSubtotal] = useState<number | string>();

  useEffect(() => {
    retrieveCart();
    console.log("api key", process.env.REACT_APP_API_KEY);
  }, []);
  //   useEffect(() => {
  //     retrieveCart();
  //   }, [cart]);

  const generateToken = async () => {
    try {
      await commerce.checkout
        .generateToken("white-shirt", { type: "permalink" })
        .then((checkout: any) => console.log("checkout ", checkout.id));
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  };

  const refreshCart = async () => {
    setLoading(true);
    try {
      await commerce.cart
        .refresh()
        .then((cart: any) => console.log("cart refreshed ", cart));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const retrieveCart = async () => {
    try {
      // setLoading(true)
      await commerce.cart
        .retrieve()
        .then((cart: { line_items: React.SetStateAction<undefined> }) => {
          console.log("cart ", cart);
          //@ts-ignore
          setSubtotal(cart?.subtotal.formatted_with_symbol);
          setCart(cart.line_items);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async () => {
    await commerce.cart
      .empty()
      .then((res: { cart: { line_items: React.SetStateAction<undefined> } }) =>
        setCart(res.cart.line_items)
      )
      .catch((err: any) => console.log(err));
  };
  const removeFromCart = async (
    prodId: React.Key | string | null | undefined
  ) => {
    try {
      await commerce.cart
        .remove(prodId)
        .then((res: any) => console.log("successfully removed", res))
        .catch((err: any) => console.log("could not remove", err));
    } catch (err: any) {
      console.log(err);
    } finally {
      retrieveCart();
    }
  };

  const decreaseQuantity = async (
    prodId: React.Key | string | null | undefined,
    quantity: number
  ) => {
    try {
      await commerce.cart
        .update(prodId, { quantity: quantity })
        .then((res: any) => console.log(res))
        .catch((err: any) => console.log("could not decrease", err));
    } catch (err) {
      console.log(err);
    } finally {
      retrieveCart();
    }
  };
  const increaseQuantity = async (prodId: string, quantity: number) => {
    try {
      await commerce.cart
        .update(prodId, { quantity: quantity })
        .then((res: any) => console.log(res))
        .catch((err: any) => console.log("could not decrease", err));
    } catch (err) {
      console.log(err);
    } finally {
      retrieveCart();
    }
  };

  if (loading) {
    return (
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: spinner,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={400}
        width={400}
        isStopped={false}
        isPaused={false}
      />
    );
  }

  if (emptyCartArray) {
    return (
      <div
        className="containerFluid"
        style={{
          width: "100%",
          height: "100vh",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: emptyCartAnimation,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
        />
      </div>
    );
  }

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      <Header emptyCart={emptyCart} />
      <div className="prodsCon">
        {/* @ts-ignore */}
        {cart?.map(
          (prod: {
            id: string;
            media: { source: string | undefined };
            quantity: number;
          }) => (
            <div key={prod.id} className="prodCon">
              <div className="prodImgCon">
                <img src={prod.media.source} className="prodImg" />
              </div>
              <div className="prodInfoCon">
                <div className="prodNameContainer">
                  <p className="prodName">{prod.quantity}...</p>
                  {/*<p className="prodName">{prod.name.slice(0, 18)}...</p>*/}
                </div>
                <button
                  className="addToCartCon"
                  onClick={() => removeFromCart(prod.id)}
                >
                  <FaCartPlus className="addToCartIcon" />
                </button>
              </div>
              <div>
                <div>
                  <button
                    onClick={() => decreaseQuantity(prod.id, prod.quantity - 1)}
                  >
                    -
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => increaseQuantity(prod.id, prod.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        <button onClick={() => refreshCart()}>REfresh cart</button>
        {subtotal && <p>Total : {subtotal}</p>}
        <button onClick={() => generateToken()}>Go checkout </button>
      </div>
    </div>
  );
};

export default Cart;
