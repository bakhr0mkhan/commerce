import React, { useEffect } from "react";
import { useCommerceContext } from "../../context";



import {Header } from '../../components'
import './styles.css'

const Dashboard = () => {
	const { commerce } = useCommerceContext();

		function fetchProducts() {
				commerce.products.list().then((products) => {
						console.log("success", products)
				}).catch((error) => {
					console.log('There was an error fetching the products', error);
				});
			}
	useEffect(() => {
		fetchProducts();
	}, []);
	return (
		<div className="container">
			<Header/>
			Dashboard
		</div>);
};

export default Dashboard;
