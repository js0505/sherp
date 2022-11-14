import { useEffect, useState } from "react"
import StoreSearchFilterForm from "../../components/store/search-filter-form"
import PageTitle from "../../components/ui/page-title"
import {
	getBrandNoneProducts,
	updateStoreCreditCount,
} from "../../lib/util/product-util"

function StoreSearchPage() {
	const [products, setProducts] = useState()

	async function getBrandNoneProductsToUtil() {
		const productList = await getBrandNoneProducts()
		setProducts(productList)
	}

	async function updateStoreCreditCountToUtil({
		storeId,
		year,
		month,
		count,
		cms,
	}) {
		const body = { storeId, year, month, count, cms }

		const response = await updateStoreCreditCount(body)

		if (response.success) {
			return response
		} else {
			return
		}
	}

	useEffect(() => {
		getBrandNoneProductsToUtil()
	}, [])

	return (
		<>
			<PageTitle title="가맹점 검색" />
			<StoreSearchFilterForm
				filteredProducts={products}
				updateStoreCreditCount={updateStoreCreditCountToUtil}
			/>
		</>
	)
}

export default StoreSearchPage
