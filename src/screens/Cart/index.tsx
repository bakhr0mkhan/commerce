import React,{useEffect, useState} from 'react'
import Lottie from "react-lottie";

import firebase from 'firebase/app'



import {signInWithGoogle} from '../../firebase/index'



import { useCommerceContext, useFirebaseContext } from "../../context/index.tsx";
import {Header } from '../../components/index.tsx'
import './styles.css'
import {FaCartPlus} from "react-icons/fa";
import cartLoading  from "../../assets/animations/cartLoading.json";
import {sign} from "node:crypto";

const Cart = () => {
	const { commerce } = useCommerceContext();
	const {currentUser} = useFirebaseContext()

    const auth = firebase.auth()

    const [cart, setCart] = useState()
    const [loading , setLoading] = useState(false)


    useEffect(()=>{
        // retrieveCart()
        // app.initializeApp(firebaseConfig);
        console.log('User is ',currentUser)
    }, [])
    useEffect(()=>{
        retrieveCart()
    }, [cart])
    useEffect(()=>{
        console.log('user is changed', currentUser)
    }, [currentUser])

    const createUserWithEmail = async () => {
        await auth.createUserWithEmailAndPassword('email322323@mail.ru', 'passoIjfoJojfoosOJ')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('newly created user', user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    const signInWithEmail = async () => {
	    await auth.signInWithEmailAndPassword('email322323@mail.ru','passoIjfoJojfoosOJ' )
            .then(userSigned => console.log('successfull sign in ',userSigned))
            .catch( err => console.log('could not sign in', err))
    }

    const signOut = async () => {
	    await auth.signOut()
            .then(res => console.log('signed out' , res))
            .catch(err => console.log("could not sign out", err))
    }

    const signInWithFacebook = async () => {
        const providerFb = new firebase.auth.FacebookAuthProvider();
	    await auth.signInWithPopup(providerFb)
            .then(res => console.log('s singin fb', res))
            .catch(err => console.log("error ", err))
    }


    const retrieveCart = async () => {
        setLoading(true)
        try {
            await commerce.cart.retrieve()
                .then((cart) => {
                    setCart(cart.line_items)
                    // console.log(cart.line_items)
                    setLoading(false)
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
        .then((res) => setCart(res.cart.line_items))
        .catch(err => console.log(err))
    }
    const removeFromCart = async (prodId) => {
        await commerce.cart.remove(prodId)
            .then((res) => console.log('successfully removed',res))
            .catch(err => console.log('could not remove',err))
    }

    const decreaseQuantity = async  (prodId, quantity) => {
        await commerce.cart.update(prodId, {quantity: quantity})
            .then(res => res)
            .catch(err => console.log('could not decrease'))
    }
    const increaseQuantity = async  (prodId, quantity) => {
        await commerce.cart.update(prodId, {quantity: quantity})
            .then(res => res)
            .catch(err => console.log('could not decrease'))
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


    return (
        <div>
            <Header emptyCart={emptyCart}/>
            <div className="prodsCon">
                {cart?.map((prod) => (
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
                                    onClick={()=>decreaseQuantity(prod.id, prod.quantity - 1)}
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
                onClick={()=>signInWithGoogle()}
            >
            SIgn in with google
            </button>
            <button
                onClick={()=>signInWithFacebook()}
            >
            SIgn in with fb
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
