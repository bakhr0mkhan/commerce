import React, { useEffect, useState, FC } from "react";
import Lottie from "react-lottie";
import { FaShoppingCart } from "react-icons/fa";

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
  //@ts-ignore
  const { commerce } = useCommerceContext();
  //@ts-ignore
  const { currentUser } = useFirebaseContext();
  const auth = firebase.auth();

  const { height, width } = useWindowDimensions();

  const history = useHistory();

  const [categories, setCategories] = useState<any>();
  const [products, setProducts] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState(localCategories[0]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("auth user", currentUser);
    fetchProducts();
    console.log("l c", localCategories);
    return () => setProducts({});
  }, []);

  useEffect(() => {
    // console.log("current h and width", height, width);
  }, [height, width]);

  useEffect(() => {
    console.log("user change", currentUser);
  }, [currentUser]);

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
      .then((res: any) => res)
      .catch((err: errorCase) => console.log("err happended", err));
  };

  useEffect(() => {
    categoryChangeProducts();
  }, [selectedCategory]);

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
      <div className="navbar">
        <div className="navbarLeft">
          <h3 className="branName">Kamazon</h3>
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
      <div className="sliderCon">
        {/* @ts-ignore */}
        <SimpleImageSlider
          width={width - 10}
          height={height / 3}
          showBullets={true}
          showNavs={true}
          navMargin={0}
          images={sliderImages}
          slideDuration={0.7}
          navSize={30}
          // onCompleteSlide={(index, length) => {
          //   index: 0;
          // }}
        />
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
