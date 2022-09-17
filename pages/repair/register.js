import { useEffect, useState } from "react"
import RepairRegisterForm from "../../components/repair/repair-register-form"
import PageTitle from "../../components/ui/page-title"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"

function RepairRegisterPage() {
	const [productList, setProductList] = useState()

	async function getAllProducts() {
		const { products, message } = await fetchHelperFunction(
			"GET",
			"/api/product",
		)
		console.log(message)
		let editedProductList = []
		if (products) {
			products.map((item) =>
				editedProductList.push({
					id: item._id,
					brand: item.brand,
					company: item.productCompany.name,
					companyId: item.productCompany._id,
					value:
						item.brand.name === "없음"
							? item.name
							: `${item.brand.name} ${item.name}`,
				}),
			)
		}

		setProductList(editedProductList)
	}

	useEffect(() => {
		getAllProducts()
	}, [])
	return (
		<>
			<PageTitle title="수리 내역 등록" />
			{productList && <RepairRegisterForm productList={productList} />}
		</>
	)
}
export default RepairRegisterPage
