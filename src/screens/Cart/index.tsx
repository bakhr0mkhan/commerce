import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
//@ts-ignore
import { useHistory } from "react-router-dom";
//@ts-ignore
import { useForm } from "react-hook-form";
import { useCommerceContext } from "../../context/index";
import "./styles.css";
// import emptyCartAnimation from "../../assets/animations/emptyCart.json";
import spinner from "../../assets/animations/spinner.json";

const Cart = () => {
  // @ts-ignore
  const { commerce } = useCommerceContext();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any>();
  const [subtotal, setSubtotal] = useState<number | string>();
  const [cart, setCart] = useState<any>();

  useEffect(() => {
    retrieveCart();
  }, []);
  useEffect(() => {
    retrieveCart();
  }, [cartItems]);

  const retrieveCart = async () => {
    // setLoading(true);
    try {
      // setLoading(true)
      await commerce.cart.retrieve().then((cart: any) => {
        setCart(cart);
        setCartItems(cart.line_items);
        // console.log("cart changed ", cart);
        setSubtotal(cart.subtotal.formatted_with_symbol);
        // //@ts-ignore
        // setCartID(cart?.id);
        // //@ts-ignore
        // setSubtotal(cart?.subtotal.formatted_with_symbol);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // const generateToken = async (cartId: string | number) => {
  //   try {
  //     await commerce.checkout
  //       .generateToken(cartId, { type: "cart" })
  //       .then((checkout: any) => console.log("checkout ", checkout));
  //   } catch (err) {
  //     console.log(err.message);
  //   } finally {
  //   }
  // };

  // const refreshCart = async () => {
  //   setLoading(true);
  //   try {
  //     await commerce.cart
  //       .refresh()
  //       .then((cart: any) => console.log("cart refreshed ", cart));
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const emptyCart = async () => {
  //   await commerce.cart
  //     .empty()
  //     .then((res: { cart: { line_items: React.SetStateAction<undefined> } }) =>
  //       setCartItems(res.cart.line_items)
  //     )
  //     .catch((err: any) => console.log(err));
  // };
  const removeFromCart = async (prodId: string | number) => {
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
    prodId: string | number,
    quantity: number
  ) => {
    try {
      await commerce.cart
        .update(prodId, { quantity: quantity - 1 })
        .then((res: any) => console.log("decreased", res));
    } catch (err) {
      console.log(err);
    } finally {
      retrieveCart();
    }
  };
  const increaseQuantity = async (
    prodId: string | number,
    quantity: number
  ) => {
    try {
      await commerce.cart
        .update(prodId, { quantity: quantity + 1 })
        .then((res: any) => console.log("increased", res));
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

  // if (emptyCartArray) {
  //   return (
  //     <div
  //       className="containerFluid"
  //       style={{
  //         width: "100%",
  //         height: "100vh",
  //         flexDirection: "row",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Lottie
  //         options={{
  //           loop: false,
  //           autoplay: true,
  //           animationData: emptyCartAnimation,
  //           rendererSettings: {
  //             preserveAspectRatio: "xMidYMid slice",
  //           },
  //         }}
  //         height={400}
  //         width={400}
  //         isStopped={false}
  //         isPaused={false}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="cartCon">
      <div className="cartItemsCon">
        <div className="cartItemsSubCon">
          {cartItems?.map((item: any) => (
            <div key={item.id} className="singleItemCon">
              <div className="itemImgCon">
                <img
                  src={item.media.source}
                  className="itemImg"
                  id="singleImg"
                />
              </div>
              <div className="itemNameCon">
                <p className="itemName">{item.name}</p>
              </div>
              <div className="itemPriceCon">
                <p className="itemPrice">
                  {item.line_total.formatted_with_symbol}
                </p>
              </div>
              <div className="itemBtnsCon">
                <button
                  className="itemButtons"
                  onClick={() => decreaseQuantity(item.id, item.quantity)}
                >
                  -
                </button>
                <p className="itemQuantity">{item.quantity}</p>
                <button
                  className="itemButtons"
                  onClick={() => increaseQuantity(item.id, item.quantity)}
                >
                  +
                </button>
              </div>
              <div className="itemRemoveBtnCon">
                <button
                  className="itemButtons"
                  onClick={() => removeFromCart(item.id)}
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          {subtotal && (
            <button
              onClick={() =>
                history.push({
                  pathname: "/checkout",
                  state: {
                    cart: cart,
                  },
                })
              }
            >
              Go checkout Subtotal : {subtotal}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
