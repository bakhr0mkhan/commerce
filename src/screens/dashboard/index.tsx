import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { FaCartPlus } from "react-icons/fa";

import { useCommerceContext } from "../../context/index.tsx";
import { Header } from "../../components/index.tsx";
import "./styles.css";
import { localCategories } from "../../assets/data/index.ts";
import commerceLoading from "../../assets/animations/commerceLoading.json";

const Dashboard = () => {
	const { commerce } = useCommerceContext();

	const [categories, setCategories] = useState();
	const [products, setProducts] = useState();
	const [selectedCategory, setSelectedCategory] = useState(localCategories[0]);
	const [loading, setLoading] = useState(false);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			await commerce.products.list().then((products) => {
				setProducts(products.data);
			});
		} catch (err) {
			console.log("THere was an error fetching the products ", err);
		} finally {
			setLoading(false);
		}
	};
	const addToCart = async (productId) => {
		await commerce.cart
			.add(productId, 1)
			.then((res) => res)
			.catch((err) => console.log("err happended", err));
	};

	useEffect(() => {
		fetchProducts();
		return;
	}, []);

	// useEffect(() => {
	// 	console.log("prods", products);
	// 	return;
	// }, [products]);

	useEffect(() => {
		categoryChangeProducts();
	}, [selectedCategory]);

	const categoryChangeProducts = async () => {
		setLoading(true)
		try {
			await commerce.products
				.list({
					category_slug: [`${selectedCategory.slug}`],
				})
				.then((products) => {
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
									<img src={category.icon} className="btnIcon" alt="Icon" />
								</div>
								<div className="categoryNameCon">
									<button className="categoryName">{category.name}</button>
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
								<p className="heading3">{selectedCategory.name}</p>
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
									<img src={prod.media.source} className="prodImg" />
								</div>
								<div className="prodInfoCon">
									<div className="prodNameContainer">
										<p className="prodName">{prod.name.slice(0, 18)}...</p>
									</div>
									<button
										className="addToCartCon"
										onClick={() => addToCart(prod.id)}
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
