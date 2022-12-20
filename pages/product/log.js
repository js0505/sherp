import { useCallback, useEffect, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import Pagenation from "../../components/ui/pagenation"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"

import ProductLogTable from "../../components/product/log/log-table"
import LogDateFilterForm from "../../components/repair/log/date-filter-form"

import PagenationUi from "../../components/ui/pagenation-lib"
function ProductLogPage() {
	const [totalPosts, setTotalPosts] = useState(null) // 모든 데이터의 갯수
	const [logs, setLogs] = useState() // 현재 페이지에 나타날 데이터
	const [startDate, setStartDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [endDate, setEndDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [page, setPage] = useState(1) // 현재 페이지네이션 번호
	const maxPosts = 10 // 한 페이지에 나타낼 총 갯수

	const updateFilterDateFunction = (start, end) => {
		if (start === "") {
			setStartDate("")
			setEndDate("")
		} else {
			setStartDate(start)
			setEndDate(end)
		}
	}

	const initFilterDateFunction = () => {
		setStartDate("")
		setEndDate("")
	}

	const pageHandleFunction = (e) => {
		const { selected } = e
		setPage(selected + 1)
	}

	const getData = useCallback(
		async (page) => {
			const response = await fetchHelperFunction(
				"GET",
				`/api/product/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
			)

			if (response.totalPosts) {
				// 최초 페이지 접속 시 총 데이터 갯수를 받아와 페이지네이션 넘버링에 사용
				setTotalPosts(response.totalPosts)
			}
			setLogs(response.productLogs)
		},
		[startDate, endDate],
	)

	useEffect(() => {
		getData(page)
	}, [getData, page, totalPosts])

	return (
		<div>
			<PageTitle title="입고, 출고 내역" />
			<div className=" w-5/6  container ">
				<LogDateFilterForm
					clearDateHandler={initFilterDateFunction}
					dateHandler={updateFilterDateFunction}
				/>
				{logs && <ProductLogTable data={logs} replaceListHandler={getData} />}

				<PagenationUi
					onPageChange={pageHandleFunction}
					pageRangeDisplayed={maxPosts}
					pageCount={totalPosts}
				/>
			</div>
		</div>
	)
}

export default ProductLogPage
