import { useEffect, useState } from "react"
import RepairRegisterForm from "../../components/repair/register-form"
import PageTitle from "../../components/ui/page-title"
import { getAllProducts } from "../../lib/util/product-util"

const RepairRegisterPage = () => {
	const [productList, setProductList] = useState()

	const getAllProductsToUtil = async () => {
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
