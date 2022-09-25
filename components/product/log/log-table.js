import { AgGridReact } from "ag-grid-react"
import React, { useState } from "react"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

function ProductLogTable(props) {
	const { data, replaceListHandler } = props

	// 표시 할 데이터
	// 제품명, 입출고, 개수, 유저, 내용, 일자
	const columns = [
		{ headerName: "제품명", field: "product.name" },
		{
			headerName: "수량",
			field: "quantity",
			type: "numericColumn",
			width: 80,
		},
		{ headerName: "입,출고", field: "calc", width: 110 },

		{ headerName: "완료자", field: "user.name", width: 100 },
		{ headerName: "내용", field: "note" },
		{ headerName: "처리일자", field: "date", width: 150 },
	]

	function onGridReady(params) {
		params.columnApi.autoSizeColumn("")
		params.api.sizeColumnsToFit()
	}

	return (
		<>
			<div className="h-96 mt-5 mb-3 lg:h-[30rem]">
				<div className="ag-theme-alpine w-full h-full">
					<AgGridReact
						defaultColDef={{
							sortable: true,
						}}
						columnDefs={columns}
						rowData={data}
						onGridReady={onGridReady}
					/>
				</div>
			</div>
		</>
	)
}

export default ProductLogTable
