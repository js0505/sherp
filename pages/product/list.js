import PageTitle from "../../components/ui/page-title"
import ProductListTable from "../../components/product/product-list-table"

const ProductListPage = () => {
	return (
		<>
			<PageTitle title="장비 리스트" />
			<div className=" w-4/5  container ">
				<ProductListTable />
			</div>
		</>
	)
}

export default ProductListPage
