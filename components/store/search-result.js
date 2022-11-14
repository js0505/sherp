import { format } from "date-fns"
import { useRef, useEffect, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import GridTable from "../ui/grid-table"
import Modal from "../ui/modal"
import StoreItemDetail from "./item-detail"

function StoreSearchResult(props) {
	const {
		searchedStore,
		setSearchedStore,
		filteredProducts,
		updateStoreCreditCount,
	} = props

	const [rowData, setRowData] = useState()
	const [selectedStore, setSelectedStore] = useState()
	const [filterYear, setFilterYear] = useState()
	const [showModal, setShowModal] = useState(false)
	function modalHandler() {
		setShowModal(!showModal)
	}

	useEffect(() => {
		setFilterYear(year)
		setRowData(searchedStore)
	}, [searchedStore, year])

	const today = new Date()
	const year = format(today, "yyyy")

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
			width: 100,
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
			width: 100,
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
		{ headerName: "담당자", field: "user.name", width: 100 },
		{ headerName: "지역", field: "city", width: 100 },
		{ headerName: "가맹점명", field: "storeName" },
		{ headerName: "사업자번호", field: "businessNum" },
		{ headerName: "VAN", field: "van", editable: true, width: 100 },
		...countColumnData,
	]
	function onGridReady(params) {
		// params.api.sizeColumnsToFit()
	}

	function onCellClick(params) {
		if (
			params.column.colId === "storeName" ||
			params.column.colId === "businessNum"
		) {
			setSelectedStore(params.data)
			modalHandler()
		}
	}

	// 셀에서 직접 거래건수, cms 수정 시에 동작
	const cellEditRequest = async (event) => {
		const oldData = event.data
		const field = event.colDef.field
		const editItemYear = event.colDef.colId.year
		const editItemMonth = event.colDef.colId.month
		const isCountEdit = event.colDef.colId.data === "count" ? true : false
		const newValue = parseInt(event.newValue)
		const newData = { ...oldData }
		const body = {
			storeId: oldData._id,
			year: editItemYear,
			month: editItemMonth,
			count: isCountEdit ? newValue : null,
			cms: isCountEdit ? null : newValue,
		}

		let filteredCorrectField = newData[field].find(
			(item) => item.year === editItemYear && item.month === editItemMonth,
		)

		// 연, 월로 데이터 조회가 안되면 새로운 데이터 추가.

		if (filteredCorrectField === undefined) {
			await updateStoreCreditCount(body)

			newData[field].push(body)
		} else {
			// 기존 데이터가 있을 때
			const response = await updateStoreCreditCount(body)

			if (response.success) {
				const correctIndex = newData[field].findIndex(
					(item) => item.year === editItemYear && item.month === editItemMonth,
				)

				isCountEdit
					? (newData[field][correctIndex].count = newValue)
					: (newData[field][correctIndex].cms = newValue)
			}
		}

		const tx = {
			update: [newData],
		}
		event.api.applyTransaction(tx)
	}

	const getRowId = (params) => {
		return params.data._id
	}
	const gridRef = useRef()
	const updateRowDataFunction = async (updatedStore) => {
		// 업데이트 된 가맹점 id로 다시 정보를 받고, 기존 데이터에서 찾아서 업데이트

		const newData = updatedStore
		// console.log(newData)

		const itemsToUpdate = []
		gridRef.current.api.forEachNodeAfterFilterAndSort(function (rowNode) {
			if (!rowNode.data._id === newData._id) {
				// 수정이 필요한 데이터가 아니면 그냥 배열에 추가
				const data = rowNode.data
				itemsToUpdate.push(data)
			} else {
				// 수정 대상인 데이터가 나타나면 변경 후 배열에 추가
				const data = rowNode.data
				data = newData
				itemsToUpdate.push(data)
			}
		})
		gridRef.current.api.applyTransaction({
			update: itemsToUpdate,
		})
	}
	return (
		<>
			{showModal && (
				<Modal>
					<StoreItemDetail
						item={selectedStore}
						setItem={setSelectedStore}
						// 디테일 페이지에서 수정이 끝나면 값을 변경하고 싶은데 에러남
						updateRowDataFunction={updateRowDataFunction}
						modalHandler={modalHandler}
						filteredProducts={filteredProducts}
					/>
				</Modal>
			)}
			<div className="w-full  mt-10">
				<div className=" text-center text-xl mb-10">검색결과</div>
				<div className="">
					<div className=" w-full ">
						<GridTable
							ref={gridRef}
							columnDefs={columns}
							rowData={rowData}
							readOnlyEdit={true}
							getRowId={getRowId}
							onGridReady={onGridReady}
							onCellClicked={onCellClick}
							onCellEditRequest={cellEditRequest}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default StoreSearchResult
