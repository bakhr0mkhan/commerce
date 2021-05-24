import React, { useEffect, useState } from "react";
//@ts-ignore
import { useHistory } from "react-router-dom";
import { useCommerceContext } from "../../context";
import useWindowDimensions from "../../hooks/useWindowDimensions";

import "./styles.css";

interface Props {}

const Payment = (props: Props) => {
  //hooks
  const { height, width } = useWindowDimensions();
  const history = useHistory();
  //@ts-ignore
  const { commerce } = useCommerceContext();

  //states
  const [checkoutTokenId, setCheckoutTokenId] = useState("");
  const [cart, setCart] = useState<any>();
  const [formData, setFormData] = useState<any>();

  //effects
  useEffect(() => {
    const state = history.location.state;
    if (state) {
      const { cart, checkoutTokenId, formData } = state;
      setCart(cart);
      setCheckoutTokenId(checkoutTokenId);
      setFormData(formData);
      console.log(state);
    }
  }, [history.location.state]);
  useEffect(() => {}, [history.location.state]);

  useEffect(() => {
    console.log("current cart", cart);
  }, [cart]);

  //funcs

  const sanitizedLineItems = (lineItems: any) => {
    return lineItems.reduce((data: any, lineItem: any) => {
      const item = data;
      let variantData = null;
      if (lineItem.selected_options.length) {
        variantData = {
          [lineItem.selected_options[0].group_id]:
            lineItem.selected_options[0].option_id,
        };
      }
      item[lineItem.id] = {
        quantity: lineItem.quantity,
        variants: variantData,
      };
      return item;
    }, {});
  };

  const handleCaptureCheckout = (e: any) => {
    e.preventDefault();
    const orderData = {
      line_items: sanitizedLineItems(cart.line_items),
      customer: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
      },
      shipping: {
        name: formData.firstName,
        street: formData.adress1,
        town_city: formData.city,
        county_state: formData.shippingSubdivision.id,
        postal_zip_code: formData.zip,
        country: formData.shippingCountry.id,
      },
      fulfillment: {
        shipping_method: formData.shippingOption.id,
      },
      billing: {
        name: formData.firstName,
        street: formData.adress1,
        town_city: formData.city,
        county_state: formData.shippingSubdivision.id,
        postal_zip_code: formData.zip,
        country: formData.shippingCountry.id,
      },
      pay_what_you_want: cart.subtotal.raw,
      payment: {
        gateway: "test_gateway",
        card: {
          number: formData.cardNum,
          expiry_month: formData.expMonth,
          expiry_year: formData.expYear,
          cvc: formData.ccv,
          postal_zip_code: formData.billingPostalZipcode,
        },
      },
    };
    handleOrderCheckout(checkoutTokenId, orderData);
  };

  const handleOrderCheckout = async (
    checkoutTokenId: string,
    newOrder: any
  ) => {
    try {
      await commerce.checkout
        .capture(checkoutTokenId, newOrder)
        .then((order: any) => {
          console.log("success", order);
          history.push("/orderconfirmation");
        })
        .catch((error: any) => {
          console.log("There was an error confirming your order", error);
          history.push("/cart");
        });
    } catch (err) {
      history.push("/cart");
    } finally {
    }

    // console.log(checkoutTokenId, newOrder);
  };
  return (
    <div className="paymentMainCon">
      <div className="navbar">
        <div className="navbarLeft" onClick={() => history.push("/")}>
          <h3 className="branName">Kamazon</h3>
        </div>
        <div className="navbarRight">
          <button
            className="confirmOrderBtn"
            onClick={(e) => handleCaptureCheckout(e)}
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="productsContainer">
        <div className="productsContainerSub" id="paymentproductsContainerSub">
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
                    height < 850 && height > 800
                      ? height / 3
                      : height > 1300
                      ? height / 5
                      : height < 850 && height > 600
                      ? height / 4.5
                      : height / 3.5,
                }}
              >
                <div className="productTop">
                  <img
                    alt="product'sPhoto"
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
                    <button className="addToCartBtn" id="removeFromCartBtn">
                      <p id="productQuantityId">
                        {product?.quantity ? product.quantity : 1}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="confirmOrderTab"></div>
    </div>
  );
};

export default Payment;
