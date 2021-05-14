import React,{useEffect, useState} from 'react'
import Lottie from "react-lottie";

import { useCommerceContext } from "../../context/index.tsx";
import {Header } from '../../components/index.tsx'
import './styles.css'
import {FaCartPlus} from "react-icons/fa";
import cartLoading  from "../../assets/animations/cartLoading.json";

const Cart = () => {
	const { commerce } = useCommerceContext();
    const [cart, setCart] = useState()
    const [loading , setLoading] = useState(false)

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


    useEffect(()=>{
        retrieveCart()
    }, [])
    useEffect(()=>{
        retrieveCart()
    }, [cart])


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

        </div>
    )
}

export default Cart
