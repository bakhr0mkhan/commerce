import React, { useEffect, useState, FC } from "react";
import Lottie from "react-lottie";
import { FaShoppingCart, FaCartPlus } from "react-icons/fa";

import { useCommerceContext, useFirebaseContext } from "../../context/index";
import "./styles.css";
import { localCategories, sliderImages } from "../../assets/data";
import commerceLoading from "../../assets/animations/commerceLoading.json";
//@ts-ignore
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import SimpleImageSlider from "react-simple-image-slider";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const Dashboard: FC = () => {
  //hooks
  //@ts-ignore
  const { commerce } = useCommerceContext();
  //@ts-ignore
  const { currentUser } = useFirebaseContext();
  const auth = firebase.auth();

  const { height, width } = useWindowDimensions();
  const history = useHistory();

  //states
  const [cart, setCart] = useState<any>();
  const [products, setProducts] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState(localCategories[0]);
  const [loading, setLoading] = useState(false);

  //effects
  useEffect(() => {
    console.log("auth user", currentUser);
    fetchProducts();
    retrieveCart();
    // console.log("l c", localCategories);
    return () => setProducts({});
  }, []);

  useEffect(() => {
    retrieveCart();
  }, [cart]);

  useEffect(() => {
    console.log("current h and width", height, width);
  }, [height, width]);

  useEffect(() => {
    console.log("user change", currentUser);
  }, [currentUser]);
  useEffect(() => {
    console.log("selected category", selectedCategory);
    categoryChangeProducts();
  }, [selectedCategory]);

  //functions

  const fetchProducts = async () => {
    setLoading(true);
    try {
      await commerce.products.list().then((products: any) => {
        const { data } = products;
        setProducts(data);
      });
    } catch (err) {
      console.log("There was an error fetching the products ", err);
    } finally {
      setLoading(false);
    }
  };
  type errorCase = {
    success: boolean;
    error?: { message: string };
  };
  const addToCart = async (productId: number) => {
    await commerce.cart
      .add(productId, 1)
      .then((res: any) => console.log("added", res))
      .catch((err: errorCase) => console.log("err happended", err));
  };

  const categoryChangeProducts = async () => {
    setLoading(true);
    try {
      await commerce.products
        .list({
          category_slug: [`${selectedCategory.slug}`],
        })
        .then((products: any) => {
          if (!products.data) {
            fetchProducts();
          }
          console.log("prods cat", products.data);
          setProducts(products.data);
        });
    } catch (err) {
      console.log("There was an error while fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await auth
      .signOut()
      .then((res) => console.log("signed out", res))
      .catch((err) => console.log("could not sign out", err));
  };

  const retrieveCart = async () => {
    await commerce.cart
      .retrieve()
      .then((res: any) => {
        setCart(res);
      })
      .catch((err: errorCase) => console.log("err", err));
  };

  if (loading) {
    return (
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: commerceLoading,
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

  return (
    <div className="mainCon">
      <div className="navbar" id="dashboardNavbar">
        <div className="navbarLeft">
          <h3 className="branName">
            Kamazon {width} :{height}
          </h3>
        </div>
        <div className="navbarRight">
          <div className="cartIconCon">
            <button
              className="cartBtn"
              onClick={() => {
                history.push("/cart");
              }}
            >
              <FaShoppingCart className="cartIcon" />
              <h3 className="cartTotalItems">
                {cart ? cart.total_unique_items : 0}
              </h3>
            </button>
          </div>
          <div className="authIconCon">
            <button
              className="authBtn"
              onClick={() => {
                currentUser ? signOut() : history.push("/login");
              }}
            >
              {currentUser ? "Log out" : "Login"}
            </button>
          </div>
        </div>
      </div>
      {/* time for slider */}
      <div className="sliderCon" id="dashboardSliderCon">
        {/* @ts-ignore */}
        <SimpleImageSlider
          width={width < 600 ? width - 10 : width - 10}
          height={
            height > 800 ? height / 3 : height < 700 ? height / 2 : height / 1.5
          }
          showBullets={true}
          showNavs={true}
          navMargin={0}
          images={sliderImages}
          slideDuration={0.7}
          navSize={30}
        />
      </div>
      {/* categories container */}
      <div className="categoriesContainer">
        <div className="categoriesSub">
          {localCategories &&
            localCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="categoryBtn"
                style={{
                  backgroundColor:
                    category === selectedCategory ? "#3b5998" : "white",
                  color: category === selectedCategory ? "white" : "#3b5998",
                }}
              >
                <img
                  alt="icon"
                  src={category.icon}
                  style={{
                    width: 15,
                    height: 15,
                  }}
                  className="cateogryBtnImg"
                />
                {category.name}
              </button>
            ))}
        </div>
      </div>

      {/* products container */}
      <div className="productsContainer">
        <div className="productsContainerSub">
          {products &&
            products.map((product: any) => (
              <div
                className="productCon"
                key={product.id}
                style={{
                  width:
                    width < 600
                      ? width / 2.6
                      : width > 1000
                      ? width / 4
                      : width / 3,
                  height:
                    height < 850 && height > 600
                      ? height / 4
                      : height > 1300
                      ? height / 5
                      : height / 3,
                }}
              >
                <div className="productTop">
                  <img
                    alt="product"
                    src={product.media.source}
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
                      {product.name.slice(0, 10)}...
                    </h5>
                    <h6 className="productPrice">
                      {product.price.formatted_with_symbol}
                    </h6>
                  </div>
                  <div className="productBottomRight">
                    <button
                      className="addToCartBtn"
                      onClick={() => addToCart(product.id)}
                    >
                      <FaCartPlus
                        className="addToCartIcon"
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* end of main con */}
    </div>

    //   <div className="container">
    //     <Header />
    //     <div className="mainCon">
    //       <div className="leftCon">
    //         <div className="">
    //           <p className="heading3">Explore</p>
    //         </div>
    //         <div className="categoriesCon">
    //           {localCategories?.map((category) => (
    //             <div
    //               key={category.name}
    //               className="categorySingleCon"
    //               style={{
    //                 backgroundColor:
    //                   category.name === selectedCategory.name
    //                     ? "#ebfaef"
    //                     : "white",
    //               }}
    //               onClick={() => setSelectedCategory(category)}
    //             >
    //               <div className="categoryIconCon">
    //                 <img src={category.icon} className="btnIcon" alt="Icon" />
    //               </div>
    //               <div className="categoryNameCon">
    //                 <button className="categoryName">{category.name}</button>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="rightCon">
    //         <div className="categoryHeaderCon">
    //           <div className="subContainer">
    //             <div>
    //               <img
    //                 src={selectedCategory.icon}
    //                 className="catIcon"
    //                 alt="Icon"
    //               />
    //             </div>
    //             <div>
    //               <p className="heading3">{selectedCategory.name}</p>
    //             </div>
    //           </div>
    //           <div>
    //             <div>
    //               <button className="filterBtn">Filter</button>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="prodsCon">
    //           {products?.map((prod: any) => (
    //             <div key={prod.id} className="prodCon">
    //               <div className="prodImgCon">
    //                 <img src={prod.media.source} className="prodImg" />
    //               </div>
    //               <div className="prodInfoCon">
    //                 <div className="prodNameContainer">
    //                   <p className="prodName">{prod.name.slice(0, 18)}...</p>
    //                 </div>
    //                 <button
    //                   className="addToCartCon"
    //                   onClick={() => addToCart(prod.id)}
    //                 >
    //                   <FaCartPlus className="addToCartIcon" />
    //                 </button>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //
  );
};

export default Dashboard;
