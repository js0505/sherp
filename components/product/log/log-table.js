import { useState } from "react"
import GridTable from "../../ui/grid-table"
import Modal from "../../ui/modal"
import ProductLogItemDetail from "./log-item-detail"

function ProductLogTable(props) {
	const { data } = props

	const [showModal, setShowModal] = useState(false)
	const [selectedItem, setSelectedItem] = useState()

	function modalHandler() {
		setShowModal(!showModal)
	}

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
		{ headerName: "VAN", field: "product.van" },
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

	function onCellClick(params) {
		setSelectedItem(params.data)
		modalHandler()
	}

	return (
		<>
			{showModal && (
				<Modal>
					<ProductLogItemDetail
						modalHandler={modalHandler}
						item={selectedItem}
					/>
				</Modal>
			)}
			<GridTable
				columnDefs={columns}
				rowData={data}
				onGridReady={onGridReady}
				onCellClicked={onCellClick}
			/>
		</>
	)
}

export default ProductLogTable
