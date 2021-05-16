import React,{useEffect, useState} from 'react'
import Lottie from "react-lottie";

import firebase from 'firebase/app'






import { useCommerceContext, useFirebaseContext } from "../../context/index";
import {Header } from '../../components/index'
import './styles.css'
import {FaCartPlus} from "react-icons/fa";
import cartLoading  from "../../assets/animations/cartLoading.json";
import {sign} from "node:crypto";
import {CartResponse} from '../../types/index'

const Cart = () => {
	// @ts-ignore
    const { commerce } = useCommerceContext();
    // @ts-ignore
	const {currentUser} = useFirebaseContext()

    const auth = firebase.auth()

    const [cart, setCart] = useState()
    const [loading , setLoading] = useState(true)


    useEffect(()=>{
        // retrieveCart()
        // app.initializeApp(firebaseConfig);
        // console.log('User is ',currentUser)
    }, [])
    useEffect(()=>{
        retrieveCart()
    }, [cart])


    const signInWithFacebook = async () => {
        const providerFb = new firebase.auth.FacebookAuthProvider();
	    await auth.signInWithPopup(providerFb)
            .then(res => console.log('s singin fb', res))
            .catch(err => console.log("error ", err))
    }


    const retrieveCart = async () => {
        try {
            // setLoading(true)
            await commerce.cart.retrieve<CartResponse>()
                .then((cart: { line_items: React.SetStateAction<undefined>; }) => {
                    setCart(cart.line_items)
                })
        }catch(err){
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    const emptyCart = async () => {
        await commerce.cart.empty()
        .then((res: { cart: { line_items: React.SetStateAction<undefined>; }; }) => setCart(res.cart.line_items))
        .catch((err: any) => console.log(err))
    }
    const removeFromCart = async (prodId: React.Key | string | null | undefined) => {
        await commerce.cart.remove(prodId)
            .then((res: any) => console.log('successfully removed',res))
            .catch((err: any) => console.log('could not remove',err))
    }

    const decreaseQuantity = async (prodId: React.Key | string | null | undefined, quantity: number) => {
        await commerce.cart.update(prodId, {quantity: quantity})
            .then((res: any)=> res)
            .catch((err: any) => console.log('could not decrease', err))
    }
    const increaseQuantity = async  (prodId:string, quantity:number) => {
        await commerce.cart.update(prodId, {quantity: quantity})
            .then((res: any) => res)
            .catch((err: any) => console.log('could not decrease', err))
    }


    if (loading) {
        return (
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: cartLoading,
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


    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div>
            <Header emptyCart={emptyCart}/>
            <div className="prodsCon">
                {cart?.map((prod: { id: React.Key | null | undefined; media: { source: string | undefined; }; quantity: {} | null | number; }) => (
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
                                    onClick={()=>decreaseQuantity(prod.id , prod.quantity - 1)}
                                >
                                    -
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={()=>increaseQuantity(prod.id, prod.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            <button
                onClick={()=>emptyCart()}
            >
            empty the cart
            </button>

            <button
                onClick={()=>createUserWithEmail()}
            >
            SIgn up
            </button>
            <button
                onClick={()=>signInWithEmail()}
            >
            SIgn in
            </button>
            <button
                onClick={()=>signOut()}
            >
            SIgn out
            </button>

        </div>
    )
}

export default Cart
