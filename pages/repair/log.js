import { useCallback, useEffect, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import CompleteRepairTable from "../../components/repair/log/log-table"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import LogDateFilterForm from "../../components/repair/log/date-filter-form"
import PagenationUi from "../../components/ui/pagenation-lib"

const RepairLogPage = () => {
	const [totalPosts, setTotalPosts] = useState(null) // 모든 데이터의 갯수
	const [repairs, setRepairs] = useState() // 현재 페이지에 나타날 데이터
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
				`/api/repair/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
			)
			if (response.totalPosts) {
				// 최초 페이지 접속 시 총 데이터 갯수를 받아와 페이지네이션 넘버링에 사용
				setTotalPosts(response.totalPosts)
			}
			setRepairs(response.repairs)
		},
		[startDate, endDate],
	)

	useEffect(() => {
		getData(page)
	}, [getData, page, totalPosts])

	return (
		<div>
			<PageTitle title="처리 완료된 수리 내역" />
			<div className=" w-5/6  container ">
				<LogDateFilterForm
					clearDateHandler={initFilterDateFunction}
					dateHandler={updateFilterDateFunction}
				/>
				{repairs && (
					<CompleteRepairTable data={repairs} replaceListHandler={getData} />
				)}

				<PagenationUi
					onPageChange={pageHandleFunction}
					pageRangeDisplayed={maxPosts}
					pageCount={totalPosts}
				/>
			</div>
		</div>
	)
}

export default RepairLogPage
