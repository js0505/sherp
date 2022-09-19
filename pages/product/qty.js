import { useEffect, useState } from "react"
import QtyUpdateForm from "../../components/product/qty/qty-update-form"
import PageTitle from "../../components/ui/page-title"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import { getAllProducts } from "../../lib/util/product-util"

function ProductQtyUpdatePage() {
	const [productList, setProductList] = useState()

	async function qtyUpdate(body) {
		const response = await fetchHelperFunction("PATCH", "/api/qty", body)

		return response
	}

	async function getAllProductsToUtil() {
		const products = await getAllProducts()
		setProductList(products)
	}

	useEffect(() => {
		getAllProductsToUtil()
	}, [])
	return (
		<>
			<PageTitle title="재고 입/출고 등록" />
			{productList && (
				<QtyUpdateForm qtyUpdate={qtyUpdate} productList={productList} />
			)}
		</>
	)
}

export default ProductQtyUpdatePage
