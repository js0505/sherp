import { api } from "../../query/api"
import GridTable from "../ui/grid-table"

const ProductListTable = () => {
	const { data } = api.useGetAllItemsByUrlQuery({ url: "product" })
	const products = data?.products

	const columns = [
		{
			headerName: "제품명",
			field: "name",
		},
		{
			headerName: "카테고리",
			field: "category",
			width: 150,
		},
		{
			headerName: "재고수량",
			field: "qty",
			floatingFilter: false,
			filter: false,
			width: 100,
			valueGetter: (params) => {
				return `${params.data.qty}대`
			},
		},
		{
			headerName: "법인명",
			field: "brand.name",
		},

		{ headerName: "VAN", field: "van" },
	]

	function onGridReady(params) {
		params.columnApi.autoSizeColumns(["qty", "name"], true)
		params.api.sizeColumnsToFit()
	}

	function onCellClick(params) {
		console.log(params)
	}

	return (
		<GridTable
			columnDefs={columns}
			rowData={products}
			onGridReady={onGridReady}
			onCellClicked={onCellClick}
			filter={true}
			floatingFilter={true}
		/>
	)
}

export default ProductListTable
