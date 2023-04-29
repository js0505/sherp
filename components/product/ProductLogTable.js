import { useState } from "react"
import Modal from "../ui/modal"
import ProductLogItemDetail from "./ProductLogItemDetail"
import dynamic from "next/dynamic"

const DynamicGridTable = dynamic(import("../ui/grid-table"))
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
		{ headerName: "법인명", field: "product.brand.name", minWidth: 150 },
		{ headerName: "제품명", field: "product.name", minWidth: 150 },
		{ headerName: "카테고리", field: "product.category", minWidth: 100 },
		{ headerName: "VAN", field: "product.van", minWidth: 100 },
		{
			headerName: "내용",
			field: "note",
			maxWidth: 350,
			cellStyle: { textAlign: "left" },
			minWidth: 150,
		},
		{
			headerName: "수량",
			valueGetter: (params) => {
				return `${params.data.quantity}대`
			},
			maxWidth: 100,
			minWidth: 100,
		},
		{
			headerName: "입,출고",
			field: "calc",
			minWidth: 100,
			maxWidth: 100,
			cellRenderer: calcRenderer,
		},

		{ headerName: "등록자", field: "user", minWidth: 100, maxWidth: 100 },
		{ headerName: "등록일자", field: "date", minWidth: 100, maxWidth: 100 },
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
				<Modal isOpen={showModal} onClose={modalHandler}>
					<ProductLogItemDetail
						modalHandler={modalHandler}
						item={selectedItem}
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

export default ProductLogTable
