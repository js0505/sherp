import { useEffect, useRef, useState } from "react"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import {
	useLazyGetFilteredStoresQuery,
	useUpdateStoreCreditCountMutation,
} from "../../query/storeApi"
import Dropdown from "react-dropdown"
import { DownArrow } from "../ui/icons/icons"
import { cityItems, vanItems } from "../../lib/variables/variables"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { format, isBefore, parseISO } from "date-fns"
import Modal from "../ui/modal"
import GridTable from "../ui/grid-table"
import Loader from "../ui/loader"
import EditStoreComponent from "./store-edit"
import { toast } from "react-toastify"

export default function StoreSearchComponent() {
	const [trigger, result] = useLazyGetFilteredStoresQuery()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const dropdownUsers = editItemforDropdownButton(allUsersData?.users)

	const today = new Date()
	const todayYear = format(today, "yyyy")

	const businessNumInputRef = useRef("")
	const storeNameInputRef = useRef("")
	const [van, setVan] = useState("")
	const [city, setCity] = useState("")
	const [user, setUser] = useState("")
	const [year, setYear] = useState(todayYear)

	const submitHandler = async (e) => {
		e.preventDefault()

		const businessNum = businessNumInputRef.current.value
		const storeName = storeNameInputRef.current.value

		if (Number.isNaN(Number(businessNum))) {
			alert("사업자번호는 숫자만 입력 가능합니다.")
			return
		}
		if (businessNum && storeName) {
			alert("사업자번호와 상호명 중 한가지만 검색 가능합니다.")
			return
		}

		const query = {
			businessNum,
			storeName,
			van: van.value ? van.value : "",
			city: city.value ? city.value : "",
			user: user.label ? user.label : "",
		}

		await trigger(query)
	}

	return (
		<>
			{result.isLoading && <Loader />}
			<section className="lg:container lg:w-5/6 w-full flex flex-col">
				<div className="">
					<form className="flex justify-center" onSubmit={submitHandler}>
						<div className=" lg:w-2/3 grid  grid-cols-6 gap-3">
							<input
								className="input-text  col-span-3 w-full mt-0 text-lg"
								type="text"
								ref={businessNumInputRef}
								placeholder="사업자번호"
								maxLength={10}
								onChange={(e) => e.target.value.replace(/[^0-9]/g, "")}
							/>
							<input
								className="input-text  col-span-3 w-full mt-0 text-lg"
								ref={storeNameInputRef}
								placeholder="가맹점명"
							/>

							<Dropdown
								className=" col-span-2"
								placeholder="VAN"
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={vanItems.slice(1, vanItems.length)}
								onChange={setVan}
								value={van}
							/>
							<Dropdown
								className=" col-span-2"
								placeholder="도시"
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={cityItems}
								onChange={setCity}
								value={city}
							/>
							<Dropdown
								className=" col-span-2"
								placeholder="담당자"
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={dropdownUsers}
								onChange={setUser}
								value={user}
							/>
							<div className="col-span-6">
								<div className="flex lg:justify-end">
									<button
										className="input-button mr-3 lg:w-[8rem] "
										type="submit"
									>
										검색
									</button>
									<button
										className="input-button lg:w-[8rem] "
										type="button"
										onClick={() => {
											businessNumInputRef.current.value = ""
											storeNameInputRef.current.value = ""
											setVan("")
											setCity("")
											setUser("")
										}}
									>
										초기화
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>

				{result.isLoading && <Loader />}

				{result.data && (
					<StoreSearchResult
						isDataLoading={result.isLoading}
						year={year}
						rowData={result.data.filteredStore}
					/>
				)}
			</section>
		</>
	)
}

function StoreSearchResult({ rowData, year, isDataLoading }) {
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

	const onCellClick = (params) => {
		if (params.column.colId === "storeName") {
			setSelectedStoreId(() => params.data._id)

			setShowModal(true)
		}
		if (params.column.colId === "businessNum") {
			navigator.clipboard.writeText(params.data.businessNum)
			toast.success("클립보드에 사업자번호가 복사 되었습니다.")
		}
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
		// 	const test = parseISO(oldData.contractDate)
		// 	const checkIsAfter = isBefore(editItemDate, test)
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
					<EditStoreComponent
						storeId={selectedStoreId}
						modalHandler={modalHandler}
					/>
				</Modal>
			)}
			{isDataLoading && <Loader />}
			{isLoading && <Loader />}
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
