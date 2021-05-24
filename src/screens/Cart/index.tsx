import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
//@ts-ignore
import { useHistory } from "react-router-dom";
//@ts-ignore
import { useCommerceContext } from "../../context/index";
import "./styles.css";
import cartLoadingAnim from "../../assets/animations/cartLoadingAnim.json";

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
                  width:
                    width < 600
                      ? width / 2.6
                      : width > 1000
                      ? width / 4
                      : width / 3,
                  height:
                    height < 850 && height > 767
                      ? height / 3
                      : height < 768
                      ? height / 4
                      : height > 1300
                      ? height / 5
                      : height / 3.5,
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
  );
};

export default Cart;
