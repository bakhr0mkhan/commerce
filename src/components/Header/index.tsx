import React, { useState, useEffect } from "react";
import { useCommerceContext } from "../../context/index.tsx";

import { Link, useLocation } from "react-router-dom";

import { FaCartPlus } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";
import "./styles.css";


const Header = (props) => {
	const location = useLocation();
	const { commerce } = useCommerceContext();
	const [cartLength, setCartLength] = useState(0);

    const retrieveCart = async () => {
        await commerce.cart
            .retrieve()
            .then((cart) => {
                if (cart.line_items.length !== cartLength) {
                    retrieveCart();
                }
                setCartLength(cart.line_items.length);
            })
            .catch((err) => console.log("error ", err));
    };

	useEffect(() => {
		retrieveCart();
	}, []);




	if (location.pathname === "/cart") {
		return (
			<div className="headerContainer">
				<div className="brandContainer">
					<p className="brandName">Some shop</p>
				</div>
                <div className="rightContainer">
				<div className="cartIconContainer">
						<button className="cartButton"
                            onClick={() => props.emptyCart}
                        >
							<GrClearOption className="cartIcon" />
						</button>
				</div>
			</div>
			</div>
		);
	}

	return (
		<div className="headerContainer">
			<div className="brandContainer">
				<p className="brandName">Some shop</p>
			</div>
			<div className="rightContainer">
				<div className="cartIconContainer">
					<Link to="cart" className="link">
						<div className="cartButton">
							<FaCartPlus className="cartIcon" />
							<p className="cartLength">{cartLength}</p>
						</div>
					</Link>
				</div>
				<div className="authContainer">
					<button className="button authButton">Login</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
