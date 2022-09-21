import { AgGridReact } from "ag-grid-react"
import React from "react"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

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
		<div className="h-96 mt-10 lg:h-5/6 w-full lg:w-4/6 container ">
			<div className="ag-theme-alpine w-full h-full">
				<AgGridReact
					defaultColDef={{
						sortable: true,
						filter: true,
						floatingFilter: true,
					}}
					columnDefs={columns}
					rowData={data}
					onGridReady={onGridReady}
					onCellClicked={onCellClick}
				/>
			</div>
		</div>
	)
}

export default ProductListTable
