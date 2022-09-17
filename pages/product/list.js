import { useEffect, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import ProductListTable from "../../components/product/product-list-table"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"

function ProductListPage() {
	const [products, setProducts] = useState()
	async function getAllProducts() {
		const response = await fetchHelperFunction("GET", "/api/product")
		setProducts(response.products)
	}
	useEffect(() => {
		getAllProducts()
	}, [])
	return (
		<>
			<PageTitle title="장비 리스트" />

			{products && <ProductListTable data={products} />}
		</>
	)
}

export default ProductListPage
