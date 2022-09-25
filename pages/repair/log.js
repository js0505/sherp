import { useEffect, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import CompleteRepairTable from "../../components/repair/log/log-table"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import RepairLogDateFilterForm from "../../components/repair/log/date-filter-form"
import PageNation from "../../components/ui/pagenation"
function RepairLogPage() {
	const [totalPosts, setTotalPosts] = useState(null) // 모든 데이터의 갯수
	const [repairs, setRepairs] = useState() // 현재 페이지에 나타날 데이터
	const [startDate, setStartDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [endDate, setEndDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [page, setPage] = useState(1) // 현재 페이지네이션 번호
	const maxPosts = 10 // 한 페이지에 나타낼 총 갯수

	function updateFilterDateFunction(start, end) {
		if (start === "") {
			setStartDate("")
			setEndDate("")
		} else {
			setStartDate(start)
			setEndDate(end)
		}
	}

	function initFilterDateFunction() {
		setStartDate("")
		setEndDate("")
	}

	function pageHandleFunction(page) {
		setPage(page)
	}

	useEffect(() => {
		async function getData(page) {
			const response = await fetchHelperFunction(
				"GET",
				`/api/repair/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
			)

			if (response.totalPosts) {
				// 최초 페이지 접속 시 총 데이터 갯수를 받아와 페이지네이션 넘버링에 사용
				setTotalPosts(response.totalPosts)
			}
			setRepairs(response.repairs)
		}
		getData(page)
	}, [page, totalPosts, startDate, endDate])

	return (
		<div>
			<PageTitle title="처리 완료된 수리 내역" />
			<div className=" w-5/6  container ">
				<RepairLogDateFilterForm
					clearDateHandler={initFilterDateFunction}
					dateHandler={updateFilterDateFunction}
				/>
				{repairs && <CompleteRepairTable data={repairs} />}
				<PageNation
					totalPosts={totalPosts}
					maxPosts={maxPosts}
					pageHandleFunction={pageHandleFunction}
				/>
			</div>
		</div>
	)
}

export default RepairLogPage
