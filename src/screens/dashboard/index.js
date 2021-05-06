import React, { useEffect, useState } from "react";
import { useCommerceContext } from "../../context";



import {Header } from '../../components'
import './styles.css'

const Dashboard = () => {
	const { commerce } = useCommerceContext();

	const [categories , setCategories] = useState()
	const [products , setProducts] = useState()

		function fetchProducts() {
				commerce.products.list().then((products) => {
					setProducts(products.data)
				}).catch((error) => {
					console.log('There was an error fetching the products', error);
				});
			}
		const fetchCategories = async () => {
			await commerce.categories.list()
			.then(categories => setCategories(categories.data))
			.catch(err => console.log("error ", err))
		}
	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, []);
	useEffect(()=>{
		console.log('categories', categories)
	},[categories])

	return (
		<div className="container">
			<Header/>
			<div className="mainCon">
				<div className="leftCon">
					<div className=""><p className="heading3">Categories</p></div>
					<div className="categoriesCon">
					{
						categories?.map((category) => <button key={category.name} className="categoryName">{category.name}</button>)
					}
					</div>
				</div>
				<div className="rightCon">
					<div className=""><p className="heading3">Explore</p></div>
					{/* <div className="categoriesCon">
					{
						categories?.map((category) => <button key={category.name} className="categoryName">{category.name}</button>)
					}
					</div> */}
				</div>
			</div>
		</div>);
};

export default Dashboard;
