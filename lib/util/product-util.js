import { api } from "../../query/api"
import { fetchHelperFunction } from "../fetch/json-fetch-data"

export const getAllProductsForDatalist = () => {
	const { data } = api.useGetAllItemsByUrlQuery({ url: "product" })
	const products = data?.products

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

// export const getBrandNoneProductsForDatalist = () => {
// 	const { data } = api.useGetAllItemsByUrlQuery({ url: "product" })

// 	const products = data?.products

// 	let filteredProductList
// 	let productList = []
// 	if (products) {
// 		filteredProductList = products.filter((item) => item.brand.name === "없음")
// 		filteredProductList.map((item) => {
// 			productList.push({
// 				id: item._id,
// 				value: `${item.name} ${item.van === "없음" ? "" : item.van}`,
// 				original: item,
// 			})
// 		})

// 		return productList
// 	}
// }

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
