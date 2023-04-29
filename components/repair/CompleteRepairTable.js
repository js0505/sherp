import { useState } from "react"
import Modal from "../ui/modal"

import { RepairItemDetail } from "./RepairItemDetail"
import dynamic from "next/dynamic"

const DynamicGridTable = dynamic(() => import("../ui/grid-table"))

function CompleteRepairTable(props) {
	const { data } = props
	const [showModal, setShowModal] = useState(false)
	const [selectedItemState, setSelectedItemState] = useState()
	const [selectedItem, setSelectedItem] = useState()
	function modalHandler() {
		setShowModal(!showModal)
	}

	// 표시 할 데이터
	// 가맹점명, 제품명, 처리상태, 개수, (완료날짜, 완료유저),
	const columns = [
		{ headerName: "법인명", field: "product.brand.name", minWidth: 100 },
		{
			headerName: "가맹점명",
			field: "storeName",
			maxWidth: 250,
			minWidth: 200,
		},
		{ headerName: "제품명", field: "product.name", minWidth: 150 },
		{ headerName: "카테고리", field: "product.category", minWidth: 100 },
		{ headerName: "VAN", field: "product.van", maxWidth: 150, minWidth: 100 },
		{
			headerName: "수량",
			maxWidth: 100,
			minWidth: 100,
			valueGetter: (param) => {
				return `${param.data.qty}대`
			},
		},
		{ headerName: "상태", field: "state", maxWidth: 110, minWidth: 100 },

		{
			headerName: "완료자",
			field: "completeUser",
			maxWidth: 100,
			minWidth: 100,
		},
		{ headerName: "완료날짜", field: "completeDate", minWidth: 150 },
	]

	function onGridReady(params) {
		params.api.sizeColumnsToFit()
	}

	function onCellClick(params) {
		setSelectedItem(params.data._id)
		setSelectedItemState(params.data.state)
		modalHandler()
	}

	return (
		<>
			{showModal && (
				<Modal isOpen={showModal} onClose={modalHandler}>
					<RepairItemDetail
						state={selectedItemState}
						modalHandler={modalHandler}
						repairId={selectedItem}
					/>
				</Modal>
			)}
			{data && (
				<DynamicGridTable
					columnDefs={columns}
					rowData={data}
					onGridReady={onGridReady}
					onCellClicked={onCellClick}
				/>
			)}
		</>
	)
}

export default CompleteRepairTable
