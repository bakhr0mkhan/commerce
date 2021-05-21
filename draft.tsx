import React, { useEffect, useState } from "react";
//@ts-ignore
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
//@ts-ignore
import Select from "react-select";

//local files
import { useCommerceContext } from "../../context";
import "./styles.css";

interface Props {}
interface FormType {
  adress1: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  zip: string;
}

interface Country {
  id: string;
  value: string;
  label: string;
}

interface ShippingOption {
  value: any;
  label: string;
}

const Checkout = (props: Props) => {
  //@ts-ignore
  const { commerce } = useCommerceContext();
  const history = useHistory();
  const [cart, setCart] = useState<any>();
  const [checkoutTokenID, setCheckoutTokenID] = useState<string>();
  const [shippingCountries, setShippingCountries] = useState<Country[]>([]);
  const [shippingCountry, setShippingCountry] = useState<Country>();
  const [shippingSubdivisions, setShippingSubdivisions] = useState<Country[]>(
    []
  );
  const [shippingSubdivision, setShippingSubdivision] = useState<Country>();
  const [shippingOption, setShippingOption] = useState<ShippingOption[]>();

  useEffect(() => {
    const cart = history.location.state.cart;
    if (cart) {
      generateToken(cart.id);
      //   setCart(cart);
      //   console.log("cart coaught", cart);
    }
  }, []);
  useEffect(() => {
    console.log("country", shippingCountry);
    //@ts-ignore
    if (shippingCountry) fetchSubdivisions(shippingCountry.id);
  }, [shippingCountry]);
  useEffect(() => {
    console.log("sub", shippingSubdivision);
    if (shippingSubdivision)
      fetchShippingOptions(
        //@ts-ignore
        checkoutTokenID,
        //@ts-ignore
        shippingCountry.id,
        //@ts-ignore
        shippingSubdivision.id
      );
  }, [shippingSubdivision]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: FormType) =>
    console.log("form data", {
      ...data,
      shippingCountry: shippingCountry,
      //@ts-ignore
      shippingOption: shippingOption[0].value,
      shippingSubdivision: shippingSubdivision,
    });

  const generateToken = async (cartID: string | number) => {
    try {
      const token = await commerce.checkout
        .generateToken(cartID, {
          type: "cart",
        })
        .then((res: any) => {
          console.log(res);
          setCheckoutTokenID(res.id);
          fetchShippingCountries(res.id);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  const fetchShippingCountries = async (checkoutTokenId: string) => {
    await commerce.services
      .localeListShippingCountries(checkoutTokenId)
      .then((res: any) => {
        const countriesDestructured = Object.entries(res.countries).map(
          ([code, name]) => ({
            id: code,
            value: name,
            label: name,
          })
        );
        // console.log(countriesDestructured);
        //@ts-ignore
        setShippingCountries(countriesDestructured);
        //@ts-ignore
        setShippingCountry(countriesDestructured[0]);
      });
  };

  const fetchSubdivisions = async (countryCode: string) => {
    await commerce.services
      .localeListSubdivisions(countryCode)
      .then((res: any) => {
        const subsDestructured = Object.entries(res.subdivisions).map(
          ([code, name]) => ({
            id: code,
            value: name,
            label: name,
          })
        );
        //@ts-ignore
        setShippingSubdivisions(subsDestructured);
        //@ts-ignore
        setShippingSubdivision(subsDestructured[0]);
      });

    //   setShippingSubdivisions(subdivisions);
    //   setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId: string,
    countryCode: string,
    stateProvinceCode: string
  ) => {
    await commerce.checkout
      .getShippingOptions(checkoutTokenId, {
        country: countryCode,
        region: stateProvinceCode,
      })
      .then((response: any) => {
        // console.log("ship option", {
        //   description: response[0].description,
        //   price: response[0].price.formatted_with_symbol,
        // });
        // console.log("op", response);
        // setShippingOptions(response)
        setShippingOption([
          {
            value: response[0],
            label: `${response[0].description}: ${response[0].price.formatted_with_symbol}`,
          },
        ]);
      });
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  useEffect(() => {});
  return (
    <div>
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
        <input type="submit" className="input" />
      </form>
      <div className="selectCon">
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={shippingCountries[0]}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="Countries"
          options={shippingCountries}
          onChange={(e: Country) => setShippingCountry(e)}
        />
        <Select
          className="basic-single"
          classNamePrefix="select"
          //   defaultValue={shippingSubdivision}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="Countries"
          options={shippingSubdivisions}
          onChange={(e: Country) => setShippingSubdivision(e)}
        />
        <Select
          className="basic-single"
          classNamePrefix="select"
          //   @ts-ignore
          //   defaultValue={shippingOption[0]}
          isDisabled={false}
          isLoading={false}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          name="Countries"
          options={shippingOption}
          onChange={(e: Country) => setShippingSubdivision(e)}
        />
      </div>
    </div>
  );
};

export default Checkout;
