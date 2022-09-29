import { AgGridReact } from "ag-grid-react"
import React, { useState } from "react"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import Modal from "../../ui/modal"
import RepairItemDetail from "../card-item-detail"

function CompleteRepairTable(props) {
	const { data, replaceListHandler } = props
	const [showModal, setShowModal] = useState(false)
	const [selectedItemState, setSelectedItemState] = useState()
	const [selectedItem, setSelectedItem] = useState()
	function modalHandler() {
		setShowModal(!showModal)
	}

	// 표시 할 데이터
	// 가맹점명, 제품명, 처리상태, 개수, (완료날짜, 완료유저),
	const columns = [
		{ headerName: "법인명", field: "product.brand.name" },
		{ headerName: "가맹점명", field: "storeName", width: 250 },
		{ headerName: "제품명", field: "product.name" },
		{
			headerName: "수량",
			type: "numericColumn",
			field: "qty",
			// cellRenderer: qtyRenderer,
		},
		{ headerName: "상태", field: "state", width: 110 },

		{ headerName: "완료자", field: "completeUser.name", width: 100 },
		{ headerName: "완료날짜", field: "completeDate" },
	]

	function onGridReady(params) {
		params.api.sizeColumnsToFit()
	}

	function onCellClick(params) {
		setSelectedItem(params.data)
		setSelectedItemState(params.data.state)
		console.log(params.data)
		setShowModal(!showModal)
	}

	return (
		<>
			{showModal && (
				<Modal>
					<RepairItemDetail
						state={selectedItemState}
						modalHandler={modalHandler}
						item={selectedItem}
						replaceListHandler={replaceListHandler}
					/>
				</Modal>
			)}
			<div className="h-96 mt-5 mb-3 lg:h-[29rem]">
				<div className="ag-theme-alpine w-full h-full">
					<AgGridReact
						defaultColDef={{
							sortable: true,
						}}
						columnDefs={columns}
						rowData={data}
						onGridReady={onGridReady}
						onCellClicked={onCellClick}
					/>
				</div>
			</div>
		</>
	)
}

export default CompleteRepairTable
