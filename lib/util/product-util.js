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
