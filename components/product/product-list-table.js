import GridTable from "../ui/grid-table"

function ProductListTable(props) {
	const { data } = props

	const columns = [
		{
			headerName: "제품명",
			field: "name",
		},
		{
			headerName: "재고수량",
			field: "qty",
			type: "numericColumn",
			floatingFilter: false,
			filter: false,
			width: 80,
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
			rowData={data}
			onGridReady={onGridReady}
			onCellClicked={onCellClick}
			filter={true}
			floatingFilter={true}
		/>
	)
}

export default ProductListTable
