import { useEffect, useState } from "react"
import StoreSearchFilterForm from "../../components/store/search-filter-form"
import PageTitle from "../../components/ui/page-title"
import { getBrandNoneProducts } from "../../lib/util/product-util"

function StoreSearchPage() {
	const [products, setProducts] = useState()

	async function getBrandNoneProductsToUtil() {
		const productList = await getBrandNoneProducts()
		setProducts(productList)
	}

	useEffect(() => {
		getBrandNoneProductsToUtil()
	}, [])

	return (
		<>
			<PageTitle title="가맹점 검색" />
			<StoreSearchFilterForm filteredProducts={products} />
		</>
	)
}

export default StoreSearchPage
