import { fetchHelperFunction } from "../fetch/json-fetch-data"

export async function getAllProducts() {
	const { products, message, success } = await fetchHelperFunction(
		"GET",
		"/api/product",
	)

	if (!success) {
		alert(message)
		return
	}

	let editedProductList = []
	if (products) {
		products.map((item) =>
			editedProductList.push({
				id: item._id,
				brand: item.brand,
				company: item.productCompany.name,
				companyId: item.productCompany._id,
				qty: item.qty,
				value:
					item.brand.name === "없음"
						? `${item.name} ${item.van === "없음" ? "" : item.van}`
						: `${item.brand.name} ${item.name} ${
								item.van === "없음" ? "" : item.van
						  }`,
			}),
		)
	}

	return editedProductList
}

export async function getBrandNoneProducts() {
	const { products, message, success } = await fetchHelperFunction(
		"GET",
		"/api/product",
	)

	if (!success) {
		alert(message)
		return
	}

	let filteredProductList
	let productList = []
	if (products) {
		filteredProductList = products.filter((item) => item.brand.name === "없음")
	}
	filteredProductList.map((item) => {
		productList.push({
			id: item._id,
			value: `${item.name} ${item.van === "없음" ? "" : item.van}`,
			original: item,
		})
	})

	return productList
}

export async function updateStoreCreditCount(body) {
	try {
		const { message, success } = await fetchHelperFunction(
			"PATCH",
			"/api/store/creditcount",
			body,
		)

		if (!success) {
			alert(message)
			return
		}

		return { success, message }
	} catch (e) {
		console.log("util err")
	}
}
