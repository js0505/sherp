import { useEffect, useState } from "react"
import RepairRegisterForm from "../../components/repair/register-form"
import PageTitle from "../../components/ui/page-title"
import { getAllProducts } from "../../lib/util/product-util"

function RepairRegisterPage() {
	const [productList, setProductList] = useState()

	async function getAllProductsToUtil() {
		const products = await getAllProducts()
		setProductList(products)
	}

	useEffect(() => {
		getAllProductsToUtil()
	}, [])
	return (
		<>
			<PageTitle title="수리 내역 등록" />
			{productList && <RepairRegisterForm productList={productList} />}
		</>
	)
}
export default RepairRegisterPage
