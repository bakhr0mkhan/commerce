import React,{useEffect, useState} from 'react'


import { useCommerceContext } from "../../context/index.tsx";
import {Header } from '../../components/index.tsx'

const Cart = () => {
	const { commerce } = useCommerceContext();
    const [cart, setCart] = useState()

    const retrieveCart = async () => {
        await commerce.cart.retrieve()
        // .then((cart) => setCart(cart.line_items))
        .then((cart) => console.log(cart.line_items))
        .catch(err => console.log('error ', err))
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

    useEffect(()=>{
        retrieveCart()
    }, [])



    return (
        <div>
            <Header emptyCart={emptyCart}/>
            <div>
            {
                cart?.map(prod => (
                    <div key={prod.id}>
                    {prod.name}
                    </div>
                ))
            }
            </div>
            <button
                onClick={()=>emptyCart()}
            >
            empty the cart
            </button>
            <button
                onClick={()=>removeFromCart()}
            >
            remove from cart
            </button>
        </div>
    )
}

export default Cart
