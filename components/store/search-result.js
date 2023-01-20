import { useRef, useEffect, useState } from "react"
import GridTable from "../ui/grid-table"
import Modal from "../ui/modal"
import StoreItemDetail from "./item-detail"
import { useUpdateStoreCreditCountMutation } from "../../query/api"

const StoreSearchResult = ({ searchedStore, year }) => {
	const [rowData, setRowData] = useState()
	const [selectedStoreId, setSelectedStoreId] = useState("")
	const [filterYear, setFilterYear] = useState()
	const [showModal, setShowModal] = useState(false)
	const [updateStoreCreditCount] = useUpdateStoreCreditCountMutation()

	function modalHandler() {
		setShowModal(!showModal)
	}

	useEffect(() => {
		setFilterYear(year)
		setRowData(searchedStore)
	}, [searchedStore, year])

	let countColumnData = []
	for (let i = 1; i < 13; i++) {
		const monthNum = i < 10 ? `0${i}` : `${i}`
		const countItem = {
			headerName: `${i}월 건수`,
			field: "creditCount",
			editable: true,
			colId: {
				year: filterYear,
				month: monthNum,
				data: "count",
			},
			minWidth: 100,
			maxWidth: 150,
			cellStyle: { textAlign: "right" },
			valueGetter: (params) => {
				const yearFiltered = params.data.creditCount
					.filter((item) => item.year === filterYear)
					.find((item) => item.month === monthNum)

				if (yearFiltered === undefined) {
					return
				} else {
					return yearFiltered.count
				}
			},
		}

		const cmsItem = {
			headerName: `${i}월 CMS`,
			field: "creditCount",
			editable: true,
			colId: {
				year: filterYear,
				month: monthNum,
				data: "cms",
			},
			width: 150,
			cellStyle: { textAlign: "right" },
			filter: false,
			floatingFilter: false,
			valueGetter: (params) => {
				const yearFiltered = params.data.creditCount
					.filter((item) => item.year === filterYear)
					.find((item) => item.month === monthNum)

				if (yearFiltered === undefined) {
					return
				} else {
					return yearFiltered.cms
				}
			},
		}
		countColumnData.push(countItem)
		countColumnData.push(cmsItem)
	}

	const columns = [
		{
			headerName: "가맹점명",
			field: "storeName",
			pinned: true,
			minWidth: 100,
			maxWidth: 250,
		},
		{
			headerName: "사업자번호",
			field: "businessNum",
			minWidth: 200,
			valueGetter: (params) => {
				const plainNumber = params.data.businessNum
				const parsedPlainNumber = String(plainNumber)
				const filteredNumber = `${parsedPlainNumber.slice(
					0,
					3,
				)}-${parsedPlainNumber.slice(3, 5)}-${parsedPlainNumber.slice(5, 10)}`

				return filteredNumber
			},
		},
		{
			headerName: "담당자",
			field: "user",
			maxWidth: 150,
		},
		{
			headerName: "지역",
			field: "city",
			minWidth: 100,
			maxWidth: 150,
		},
		{
			headerName: "주소",
			field: "address",
			minWidth: 100,
		},
		{ headerName: "VAN", field: "van", minWidth: 100, maxWidth: 150 },
		{
			headerName: "영업상태",
			field: "inOperation",
			minWidth: 100,
			maxWidth: 150,
		},
		...countColumnData,
	]

	const onCellClick = (params) => {
		if (
			params.column.colId === "storeName" ||
			params.column.colId === "businessNum"
		) {
			setSelectedStoreId(() => params.data._id)

			modalHandler()
		}
	}

	// 셀에서 직접 거래건수, cms 수정 시에 동작
	const cellEditRequest = async (event) => {
		// 수정 대상 데이터
		const oldData = event.data

		// if (oldData.inOperation === "폐업") {
		// 	alert("폐업 가맹점은 데이터를 변경 할 수 없습니다.")
		// 	return
		// }

		// 현재 수정하는 연, 월, 수정 데이터 종류
		const editItemYear = event.colDef.colId.year
		const editItemMonth = event.colDef.colId.month
		const isCountEdit = event.colDef.colId.data === "count" ? true : false
		const newValue = parseInt(event.newValue)

		const body = {
			storeId: oldData._id,
			year: editItemYear,
			month: editItemMonth,
			count: isCountEdit ? newValue : null,
			cms: isCountEdit ? null : newValue,
			inOperation: oldData.inOperation,
		}

		await updateStoreCreditCount(body)
	}

	const getRowId = (params) => {
		return params.data._id
	}
	const gridRef = useRef()

	return (
		<>
			{showModal && (
				<Modal>
					<StoreItemDetail
						storeId={selectedStoreId}
						modalHandler={modalHandler}
					/>
				</Modal>
			)}
			<GridTable
				ref={gridRef}
				columnDefs={columns}
				rowData={rowData}
				readOnlyEdit={true}
				getRowId={getRowId}
				onCellClicked={onCellClick}
				onCellEditRequest={cellEditRequest}
				filter={true}
				floatingFilter={true}
			/>
		</>
	)
}

export default StoreSearchResult
