import React, { useEffect, useState } from "react";
//@ts-ignore
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCommerceContext } from "../../context";
//@ts-ignore
import Select from "react-select";

interface Props {}

const Checkout = (props: Props) => {
  const history = useHistory();
  //@ts-ignore
  const { commerce } = useCommerceContext();

  //states
  const [checkoutTokenId, setCheckoutTokenId] = useState("");
  const [cart, setCart] = useState<any>();
  const [shippingCountries, setShippingCountries] = useState<any>();
  const [shippingCountry, setShippingCountry] = useState<any>();
  const [shippingSubdivisions, setShippingSubdivisions] = useState<any>();
  const [shippingSubdivision, setShippingSubdivision] = useState<any>();
  const [shippingOption, setShippingOption] = useState<any>();
  const [shippingOptions, setShippingOptions] = useState<any>();
  const [formInput, setFormInput] = useState<any>();

  //effects
  useEffect(() => {
    const cart = history.location.state.cart;
    if (cart) {
      console.log("cart", cart);
      setCart(cart);
      generateCheckoutToken(cart.id);
    }
    return () => {
      // cleanup
    };
  }, []);

  useEffect(() => {
    if (checkoutTokenId) fetchShippingCountries(checkoutTokenId);
  }, [checkoutTokenId]);
  useEffect(() => {
    // if (shippingCountries) fetchShippingCountries(shippingCountries);
    // if (shippingCountries) console.log("countries ship", shippingCountries);
  }, [shippingCountries]);

  useEffect(() => {
    // if (shippingCountries) fetchShippingOptions(checkoutTokenId, "AF");
  }, [shippingCountries]);

  useEffect(() => {
    if (shippingCountry) {
      console.log("country changed", shippingCountry);
      fetchSubdivisions(shippingCountry.value);
    }
  }, [shippingCountry]);
  useEffect(() => {
    if (shippingSubdivision) {
      console.log("subdivision changed", shippingSubdivision);
      if (checkoutTokenId && shippingSubdivision) {
        fetchShippingOptions(
          checkoutTokenId,
          shippingCountry.value,
          shippingSubdivision.value
        );
      }
    }
  }, [shippingSubdivision]);
  useEffect(() => {
    if (shippingOption) console.log("shippingOption", shippingOption);
  }, [shippingOption]);

  //functions
  const generateCheckoutToken = async (cartId: string | number) => {
    await commerce.checkout
      .generateToken(cartId, { type: "cart" })
      .then((token: any) => {
        console.log("token", token);
        setCheckoutTokenId(token.id);
      })
      .catch((error: any) => {
        console.log("There was an error in generating a token", error);
      });
  };

  const fetchShippingCountries = async (checkoutTokenId: any) => {
    commerce.services
      .localeListShippingCountries(checkoutTokenId)
      .then((res: any) => {
        const { countries } = res;
        const structuredCountries = Object.entries(countries).map(
          ([code, name]) => ({
            id: code,
            value: code,
            label: name,
          })
        );
        console.log("array of countries ", structuredCountries);
        setShippingCountries(structuredCountries);
      })
      .catch((error: any) => {
        console.log(
          "There was an error fetching a list of shipping countries",
          error
        );
      });
  };

  const fetchSubdivisions = async (countryCode: string | number) => {
    await commerce.services
      .localeListSubdivisions(countryCode)
      .then((res: any) => {
        const { subdivisions } = res;
        const structuredSubdivisions = Object.entries(subdivisions).map(
          ([code, name]) => ({
            id: code,
            value: code,
            label: name,
          })
        );
        console.log("structuredSubdivisions", structuredSubdivisions);
        setShippingSubdivisions(structuredSubdivisions);
      })
      .catch((error: any) => {
        console.log("There was an error fetching the subdivisions", error);
      });
  };

  const fetchShippingOptions = async (
    checkoutTokenId: any,
    country: any,
    stateProvince = null
  ) => {
    await commerce.checkout
      .getShippingOptions(checkoutTokenId, {
        country: country,
        region: stateProvince,
      })
      .then((res: any) => {
        // const shippingOption = options[0] || null;
        // console.log("option", shippingOption);
        // setShippingOption(shippingOption);
        console.log("ship options", res);
        setShippingOptions(res);
        setShippingOption(res[0]);
      })
      .catch((error: any) => {
        console.log("There was an error fetching the shipping methods", error);
      });
  };

  //form stuff
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    const formInfo = {
      ...data,
      shippingCountry,
      shippingSubdivision,
      shippingOption,
    };
    try {
      setFormInput(formInfo);
      history.push({
        pathname: "/payment",
        state: {
          formData: formInfo,
          cart,
          checkoutTokenId,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log(formInfo);
    }
  };
  return (
    <div>
      <div> this is checkout</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("firstName")}
          placeholder="First name"
          className="input"
        />{" "}
        {/* register an input */}
        <input
          {...register("lastName", { required: true })}
          placeholder="Last name"
          className="input"
        />
        <input
          {...register("adress1", { required: true })}
          placeholder="Adress"
          className="input"
        />
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          className="input"
        />
        <input
          {...register("city", { required: true })}
          placeholder="City"
          className="input"
        />
        <input
          {...register("zip", { required: true })}
          placeholder="ZIP/Postal code"
          className="input"
        />
        <input
          {...register("cardNum", { required: true })}
          placeholder="Card Num"
          className="input"
        />
        <input
          {...register("expMonth", { required: true })}
          placeholder="expMonth"
          className="input"
        />
        <input
          {...register("expYear", { required: true })}
          placeholder="expYear"
          className="input"
        />
        <input
          {...register("ccv", { required: true })}
          placeholder="ccv"
          className="input"
        />
        <input
          {...register("billingPostalZipcode", { required: true })}
          placeholder="billingPostalZipcode"
          className="input"
        />
        <input type="submit" className="input" />
      </form>
      <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="Countries"
        options={shippingCountries}
        onChange={(e: any) => setShippingCountry(e)}
      />
      <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="Countries"
        options={shippingSubdivisions}
        onChange={(e: any) => setShippingSubdivision(e)}
      />
      {/* <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="Countries"
        options={shippingOptions}
        onChange={(e: any) => setShippingOption(e)}
      /> */}
    </div>
  );
};

export default Checkout;
