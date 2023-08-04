import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { AgGridReact, AgGridColumnProps } from "ag-grid-react"
import { Store } from "../../models/Store"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { useUpdateStoreCreditCountMutation } from "@/query/storeApi"
import useUpdateStoreModal from "@/hooks/useUpdateStoreModal"

interface IProps {
	data: Store[]
}
function StoreTable(props: IProps) {
	const { data } = props
	const updateStoreModal = useUpdateStoreModal()

	const [updateStoreCreditCount] = useUpdateStoreCreditCountMutation()

	const year = format(new Date(), "yyyy")

	let countColumnData = []

	for (let i = 1; i < 13; i++) {
		const monthNum = i < 10 ? `0${i}` : `${i}`
		const countItem = {
			headerName: `${i}월 건수`,
			field: "creditCount",
			editable: true,
			colId: {
				year: year,
				month: monthNum,
				data: "count",
			},
			minWidth: 100,
			maxWidth: 100,
			cellStyle: { textAlign: "right" },
			valueGetter: (params) => {
				const yearFiltered = params.data.creditCount
					.filter((item) => item.year === year)
					.find((item) => item.month === monthNum)

				if (yearFiltered === undefined) {
					return
				}
				return yearFiltered.count
			},
		}

		const cmsItem = {
			headerName: `${i}월 CMS`,
			field: "creditCount",
			editable: true,
			colId: {
				year: year,
				month: monthNum,
				data: "cms",
			},
			width: 100,
			cellStyle: {
				textAlign: "right",
			},
			filter: false,
			floatingFilter: false,
			valueGetter: (params) => {
				const yearFiltered = params.data.creditCount
					.filter((item) => item.year === year)
					.find((item) => item.month === monthNum)

				if (yearFiltered === undefined) {
					return
				}
				return yearFiltered.cms
			},
		}
		countColumnData.push(countItem)
		countColumnData.push(cmsItem)
	}

	const columns: AgGridColumnProps[] = [
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
			maxWidth: 150,
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
			maxWidth: 100,
		},
		{
			headerName: "지역",
			field: "city",
			maxWidth: 100,
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
			maxWidth: 100,
			cellRenderer: (props) => {
				return (
					<span
						className={`${
							props.value === "폐업"
								? "text-red-400"
								: props.value === "영업중"
								? "text-green-700"
								: "text-sky-700"
						} font-semibold`}
					>
						{props.value}
					</span>
				)
			},
		},
		...countColumnData,
	]

	const onCellClicked = async (params) => {
		if (params.column.colId === "storeName") {
			updateStoreModal.setStoreId(params.data._id)
			updateStoreModal.onOpen()
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
	const cellEditRequest = async (event: any) => {
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
			)?.cms || oldData.cms

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

		const response = await updateStoreCreditCount(body).unwrap()

		if (!response.success) {
			toast.error(response.message)
			return
		}

		toast.success(response.message)
	}

	const getRowId = (params) => {
		return params.data._id
	}

	if (!data) {
		return null
	}

	return (
		<>
			<div className="w-full overflow-auto md:pl-10">
				<div className="ag-theme-alpine h-[50vh] md:h-[70vh]">
					<AgGridReact
						defaultColDef={{
							resizable: true,
							sortable: true,
							filter: false,
							floatingFilter: false,
							cellStyle: {
								textAlign: "left",
								fontSize: "17px",
								paddingTop: "17px",
							},
							autoHeight: true,
						}}
						rowHeight={60}
						headerHeight={50}
						readOnlyEdit={true}
						columnDefs={columns}
						rowData={data}
						getRowId={getRowId}
						onCellClicked={onCellClicked}
						onCellEditRequest={cellEditRequest}
						suppressDragLeaveHidesColumns={true}
					/>
				</div>
			</div>
		</>
	)
}

export default StoreTable
