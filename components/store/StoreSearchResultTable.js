import { useEffect, useRef, useState } from "react"
import { useUpdateStoreCreditCountMutation } from "../../query/storeApi"
import Modal from "../ui/modal"
import Loader from "../ui/loader"
import { toast } from "react-toastify"
import StoreEditPage from "./StoreEditPage"

import dynamic from "next/dynamic"

const DynamicGridTable = dynamic(() => import("../ui/grid-table"))

const StoreSearchResultTable = ({ rowData, year, isDataLoading }) => {
	const [selectedStoreId, setSelectedStoreId] = useState("")
	const [filterYear, setFilterYear] = useState()
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [updateStoreCreditCount] = useUpdateStoreCreditCountMutation()

	function modalHandler() {
		setShowModal(!showModal)
	}

	useEffect(() => {
		setFilterYear(year)
	}, [year])

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
			cellRenderer: (props) => {
				return (
					<span
						className={`${
							props.value === "폐업"
								? "text-red"
								: props.value === "영업중"
								? "text-green"
								: "text-primary"
						} font-semibold`}
					>
						{props.value}
					</span>
				)
			},
		},
		...countColumnData,
	]

	const onCellClick = async (params) => {
		if (params.column.colId === "storeName") {
			setSelectedStoreId(() => params.data._id)
			setShowModal(true)
		}
		if (params.column.colId === "businessNum") {
			clipboardLogicFunction(
				params.data.businessNum,
				"클립보드에 사업자번호가 복사 되었습니다.",
			)
		}
		if (params.column.colId === "address") {
			clipboardLogicFunction(
				params.data.address,
				"클립보드에 주소가 복사 되었습니다.",
			)
		}
	}

	const clipboardLogicFunction = async (data, message) => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(data)
			toast.success(message)
			return
		}

		const textArea = document.createElement("textarea")
		textArea.value = data
		document.body.appendChild(textArea)
		textArea.select()
		textArea.setSelectionRange(0, 99999)
		try {
			document.execCommand("copy")
		} catch (err) {
			console.error("복사 실패", err)
		}
		textArea.setSelectionRange(0, 0)
		document.body.removeChild(textArea)
		toast.success(message)
	}

	// 셀에서 직접 거래건수, cms 수정 시에 동작
	const cellEditRequest = async (event) => {
		setIsLoading(true)
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

		// todo: 계약일 이전의 데이터에는 접근 할 수 없도록 로직 생성.
		// if (oldData.contractDate) {
		// 	const editItemDate = parseISO(`${editItemYear}-${editItemMonth}`)
		// 	const isCorporation = parseISO(oldData.contractDate)
		// 	const checkIsAfter = isBefore(editItemDate, isCorporation)
		// 	console.log(oldData.contractDate)
		// 	console.log(checkIsAfter)
		// }

		// console.log(oldData.creditCount)

		const oldDataCms =
			oldData.creditCount.find(
				(item) => item.year === editItemYear && item.month === editItemMonth,
			)?.cms || 0

		const oldDataCount =
			oldData.creditCount.find(
				(item) => item.year === editItemYear && item.month === editItemMonth,
			)?.count || 0

		const body = {
			storeId: oldData._id,
			year: editItemYear,
			month: editItemMonth,
			count: isCountEdit ? newValue : oldDataCount,
			cms: isCountEdit ? oldDataCms : newValue,
			inOperation: oldData.inOperation,
		}

		const response = await updateStoreCreditCount(body)

		if (response.data.success) {
			toast.success(response.data.message)
		} else {
			toast.error(response.data.message)
		}
		setIsLoading(false)
	}

	const getRowId = (params) => {
		return params.data._id
	}
	const gridRef = useRef()

	return (
		<>
			{showModal && (
				<Modal isOpen={showModal} onClose={modalHandler}>
					<StoreEditPage
						storeId={selectedStoreId}
						modalHandler={modalHandler}
					/>
				</Modal>
			)}
			{isDataLoading && <Loader />}
			{isLoading && <Loader />}

			<DynamicGridTable
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
export default StoreSearchResultTable
