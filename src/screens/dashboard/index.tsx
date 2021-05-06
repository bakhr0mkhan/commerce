import React, { useEffect, useState } from "react";
import { useCommerceContext } from "../../context/index.tsx";

import { Header } from "../../components/index.tsx";
import "./styles.css";
import { FaCartPlus } from "react-icons/fa";

import { localCategories } from "../../assets/data/index.ts";

const Dashboard = () => {
	const { commerce } = useCommerceContext();

	const [categories, setCategories] = useState();
	const [products, setProducts] = useState();
	const [selectedCategory, setSelectedCategory] = useState(
		localCategories[0]
	);

	const fetchProducts = () => {
		commerce.products
			.list()
			.then((products) => {
				setProducts(products.data);
			})
			.catch((error) => {
				console.log("There was an error fetching the products", error);
			});
	};
	const fetchCategories = async () => {
		await commerce.categories
			.list()
			.then((categories) => setCategories(categories.data))
			.catch((err) => console.log("error ", err));
	};

	const addToCart = async (productId) => {
		await commerce.cart.add(productId, 1)
		.then((response) => {
			console.log('added')
			})
		.catch(err => console.log('err happended' , err))
	}



	useEffect(() => {
		fetchCategories();
		fetchProducts();
		return 
	}, []);
	useEffect(() => {
		console.log("cats", categories);
		console.log("prods", products);
		return
	}, [categories, products]);

	return (
		<div className="container">
			<Header />
			<div className="mainCon">
				<div className="leftCon">
					<div className="">
						<p className="heading3">Explore</p>
					</div>
					<div className="categoriesCon">
						{localCategories?.map((category) => (
							<div
								key={category.name}
								className="categorySingleCon"
								style={{
									backgroundColor:
										category.name === selectedCategory.name
											? "#ebfaef"
											: "white",
								}}
								onClick={() => setSelectedCategory(category)}
							>
								<div className="categoryIconCon">
									<img
										src={category.icon}
										className="btnIcon"
										alt="Icon"
									/>
								</div>
								<div className="categoryNameCon">
									<button className="categoryName">
										{category.name}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="rightCon">
					<div className="categoryHeaderCon">
						<div className="subContainer">
							<div>
								<img
									src={selectedCategory.icon}
									className="catIcon"
									alt="Icon"
								/>
							</div>
							<div>
								<p className="heading3">
									{selectedCategory.name}
								</p>
							</div>
						</div>
						<div>
							<div>
								<button className="filterBtn">Filter</button>
							</div>
						</div>
					</div>

					<div className="prodsCon">
						{products?.map((prod) => (
							<div key={prod.id} className="prodCon">
								<div className="prodImgCon">
									<img
										src={prod.media.source}
										className="prodImg"
									/>
								</div>
								<div className="prodInfoCon">
									<div className="prodNameContainer">
										<p className="prodName">{prod.name.slice(0,18)}...</p>
									</div>
									<button className="addToCartCon"
										onClick={()=> addToCart(prod.id)}
									>
										<FaCartPlus className="addToCartIcon" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
