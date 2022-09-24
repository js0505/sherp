import { useEffect, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
function RepairLogPage() {
	const [totalPosts, setTotalPosts] = useState(null) // 모든 데이터의 갯수
	const [repairs, setRepairs] = useState() // 현재 페이지에 나타날 데이터
	const [startDate, setStartDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [endDate, setEndDate] = useState(null) // 현재 페이지에 나타날 데이터
	const [page, setPage] = useState(1) // 현재 페이지네이션 번호
	const maxPosts = 2 // 한 페이지에 나타낼 총 갯수

	function pageNumbersFunction(totalPosts) {
		const numbers = []
		const totalPages = Math.ceil(totalPosts / maxPosts)
		for (let i = 1; i <= totalPages; i++) {
			numbers.push(i)
		}
		return numbers
	}

	useEffect(() => {
		async function getData(page) {
			const response = await fetchHelperFunction(
				"GET",
				`/api/repair/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
			)

			console.log(response)
			if (response.totalPosts) {
				// 최초 페이지 접속 시 총 데이터 갯수를 받아와 페이지네이션 넘버링에 사용
				setTotalPosts(response.totalPosts)
			}
			setRepairs(response.repairs)
		}
		getData(page)
	}, [page, totalPosts, startDate, endDate])

	const pagenationNumbers = pageNumbersFunction(totalPosts)
	// 표시 할 데이터
	// 가맹점명, 제품명, 처리상태, 개수, (완료날짜, 완료유저),
	return (
		<div>
			<button
				onClick={() => {
					setStartDate("2022-09-14")
					setEndDate("2022-09-15")
				}}
			>
				filter
			</button>
			<>
				{repairs &&
					repairs.map((item, index) => <div key={index}>{item.storeName}</div>)}
			</>
			{pagenationNumbers.map((item, index) => (
				<>
					<button
						key={index + "d"}
						className="mr-3"
						onClick={() => setPage(item)}
					>
						{item}
					</button>
				</>
			))}
		</div>
	)
}

export default RepairLogPage
