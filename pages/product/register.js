import ProductRegisterForm from "../../components/product/product-register-form"
import PageTitle from "../../components/ui/page-title"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"

function ProductRegisterPage() {
	async function addProduct(body) {
		const response = await fetchHelperFunction("POST", "/api/product", body)
		return response
	}
	return (
		<>
			<PageTitle title="장비 등록" />
			<ProductRegisterForm addProduct={addProduct} />
		</>
	)
}

export default ProductRegisterPage
