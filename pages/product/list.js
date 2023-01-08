import PageTitle from "../../components/ui/page-title"
import FilterProductList from "../../components/product/filter-product-list"

const ProductListPage = () => {
	return (
		<>
			<PageTitle title="장비 리스트" />

			<FilterProductList />
		</>
	)
}

export default ProductListPage
