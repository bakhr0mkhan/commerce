import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
//@ts-ignore
import { useHistory } from "react-router-dom";
//@ts-ignore
import { useForm } from "react-hook-form";
import { useCommerceContext } from "../../context/index";
import "./styles.css";
import cartLoadingAnim from "../../assets/animations/cartLoadingAnim.json";
import emptyCartAnim from "../../assets/animations/emptyCartAnim.json";

import { FaShoppingCart } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { MdRemoveShoppingCart } from "react-icons/md";

import useWindowDimensions from "../../hooks/useWindowDimensions";

const Cart = () => {
  //hooks
  // @ts-ignore
  const { commerce } = useCommerceContext();
  const history = useHistory();
  const { height, width } = useWindowDimensions();

  //states

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any>();

  //effects
  useEffect(() => {
    retrieveCart();
  }, []);

  useEffect(() => {
    retrieveCart();
  }, [cart]);

  //functions
  const retrieveCart = async () => {
    // setLoading(true);
    try {
      // setLoading(true)
      await commerce.cart.retrieve().then((cart: any) => {
        setCart(cart);
        // console.log("cart changed ", cart);
      });
    } catch (err) {
      history.push("/");
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

  const emptyCart = async () => {
    await commerce.cart
      .empty()
      .then((cart: any) => setCart(cart))
      .catch((err: any) => console.log(err));
  };

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
          animationData: cartLoadingAnim,
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

  const goCheckoutFunc = () => {
    try {
      if (cart) {
        history.push({
          pathname: "/checkout",
          state: {
            cart,
          },
        });
      } else {
        history.push("/");
      }
    } catch (err) {
      console.log("could not", err);
    }
  };

  return (
    <div className="cartMainCon">
      <div className="navbar">
        <div className="navbarLeft" onClick={() => history.push("/")}>
          <h3 className="branName">Kamazon</h3>
        </div>
        <div className="navbarRight">
          <div className="cartIconCon">
            <button
              className="cartBtn"
              onClick={() => {
                emptyCart();
              }}
            >
              <BsTrash className="cartIcon" />
            </button>
          </div>
          {/* <div className="authIconCon">
            <button
              className="authBtn"
              onClick={() => {
                currentUser ? signOut() : history.push("/login");
              }}
            >
              {currentUser ? "Log out" : "Login"}
            </button>
          </div> */}
        </div>
      </div>

      {/* prods */}
      <div className="productsContainer">
        <div className="productsContainerSub" id="cartproductsContainerSub">
          {cart?.line_items &&
            cart?.line_items.map((product: any) => (
              <div
                className="productCon"
                key={product?.id}
                style={{
                  width: width / 2.6,
                  height: height / 4,
                }}
              >
                <div className="productTop">
                  <img
                    src={product?.media.source}
                    // style={{
                    //   width: 30,
                    //   height: 50,
                    // }}
                    className="productImg"
                  />
                </div>
                <div className="productBottom">
                  <div className="productBottomLeft">
                    <h5 className="productName">
                      {product?.name.slice(0, 10)}...
                    </h5>
                    <h6 className="productPrice">
                      {product?.price.formatted_with_symbol}
                    </h6>
                  </div>
                  <div className="productBottomRight">
                    <button
                      className="addToCartBtn"
                      onClick={() => removeFromCart(product?.id)}
                      id="removeFromCartBtn"
                    >
                      <MdRemoveShoppingCart
                        className="addToCartIcon"
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                      <p>{product?.quantity ? product.quantity : 1}</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* bottom checkout navigator */}
      <div className="cartBottomTab">
        <div className="cartBottomTabLeft">
          {cart?.subtotal?.formatted_with_symbol ? (
            <h3 className="subtotalText">
              Subtotal: {cart.subtotal.formatted_with_symbol}
            </h3>
          ) : (
            <div></div>
          )}
        </div>
        <div className="cartBottomTabRight">
          <button className="goCheckoutBtn" onClick={goCheckoutFunc}>
            Go checkout
          </button>
        </div>
      </div>

      {/* end of main */}
      {/* <div className="cartMainCon"></div>
      <div className="cartMainCon"></div> */}
    </div>
    // <div className="cartCon">
    //   <div className="cartItemsCon">
    //     <div className="cartItemsSubCon">
    //       {cartItems?.map((item: any) => (
    //         <div key={item.id} className="singleItemCon">
    //           <div className="itemImgCon">
    //             <img
    //               src={item.media.source}
    //               className="itemImg"
    //               id="singleImg"
    //             />
    //           </div>
    //           <div className="itemNameCon">
    //             <p className="itemName">{item.name}</p>
    //           </div>
    //           <div className="itemPriceCon">
    //             <p className="itemPrice">
    //               {item.line_total.formatted_with_symbol}
    //             </p>
    //           </div>
    //           <div className="itemBtnsCon">
    //             <button
    //               className="itemButtons"
    //               onClick={() => decreaseQuantity(item.id, item.quantity)}
    //             >
    //               -
    //             </button>
    //             <p className="itemQuantity">{item.quantity}</p>
    //             <button
    //               className="itemButtons"
    //               onClick={() => increaseQuantity(item.id, item.quantity)}
    //             >
    //               +
    //             </button>
    //           </div>
    //           <div className="itemRemoveBtnCon">
    //             <button
    //               className="itemButtons"
    //               onClick={() => removeFromCart(item.id)}
    //             >
    //               x
    //             </button>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     <div>
    //       {subtotal && (
    //         <button
    //           onClick={() =>
    //             history.push({
    //               pathname: "/checkout",
    //               state: {
    //                 cart: cart,
    //               },
    //             })
    //           }
    //         >
    //           Go checkout Subtotal : {subtotal}
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Cart;
