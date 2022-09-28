import { AgGridReact } from "ag-grid-react"
import React, { useState } from "react"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

function ProductLogTable(props) {
	const { data, replaceListHandler } = props

	function calcRenderer(props) {
		return (
			<span
				className={`${
					props.value === "minus" ? "text-red" : "text-primary"
				} font-semibold`}
			>
				{props.value === "minus" ? "출고" : "입고"}
			</span>
		)
	}
	// 표시 할 데이터
	// 제품명, 입출고, 개수, 유저, 내용, 일자
	const columns = [
		{ headerName: "법인명", field: "product.brand.name" },
		{ headerName: "제품명", field: "product.name" },
		{ headerName: "내용", field: "note", width: 350 },
		{
			headerName: "수량",
			type: "numericColumn",
			// field: "quantity",
			valueGetter: (params) => {
				return `${params.data.quantity}대`
			},
		},
		{
			headerName: "입,출고",
			field: "calc",
			width: 100,
			cellRenderer: calcRenderer,
		},

		{ headerName: "등록자", field: "user.name", width: 100 },
		{ headerName: "등록일자", field: "date" },
	]

	function onGridReady(params) {
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
