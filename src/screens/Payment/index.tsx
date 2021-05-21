import React, { useEffect, useState } from "react";
//@ts-ignore
import { useHistory } from "react-router-dom";
import { useCommerceContext } from "../../context";
interface Props {}

const Payment = (props: Props) => {
  const history = useHistory();
  //@ts-ignore
  const { commerce } = useCommerceContext();

  const [checkoutTokenId, setCheckoutTokenId] = useState("");
  const [cart, setCart] = useState<any>();
  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    const state = history.location.state;
    if (state) {
      const { cart, checkoutTokenId, formData } = state;
      setCart(cart);
      setCheckoutTokenId(checkoutTokenId);
      setFormData(formData);
      console.log(state);
    }
  }, []);

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
          history.push("/");
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
    <div>
      <div>Payment</div>
      <button onClick={(e) => handleCaptureCheckout(e)}>Capture order</button>
    </div>
  );
};

export default Payment;
