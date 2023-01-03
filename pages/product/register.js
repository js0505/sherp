import ProductRegisterForm from "../../components/product/product-register-form"
import PageTitle from "../../components/ui/page-title"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"

const ProductRegisterPage = () => {
	return (
		<>
			<PageTitle title="장비 등록" />
			<ProductRegisterForm />
		</>
	)
}

export default ProductRegisterPage
