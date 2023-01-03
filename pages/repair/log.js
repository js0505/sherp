import { useRef, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import CompleteRepairTable from "../../components/repair/log/log-table"
import PagenationUi from "../../components/ui/pagenation-lib"
import { api } from "../../query/api"

const RepairLogPage = () => {
	const [page, setPage] = useState(1) // 현재 페이지네이션 번호
	const [dateFilter, setDateFilter] = useState({
		startDate: null,
		endDate: null,
	}) //
	const maxPosts = 20 // 한 페이지에 나타낼 총 갯수

	const startDateInputRef = useRef()
	const endDateInputRef = useRef()

	const { data, isLoading } = api.useGetRepairLogQuery({
		page,
		maxPosts,
		startDate: dateFilter.startDate,
		endDate: dateFilter.endDate,
	})

	const onDateFilterHandler = async (e) => {
		e.preventDefault()
		setDateFilter({
			startDate: startDateInputRef.current.value,
			endDate: endDateInputRef.current.value,
		})
	}

	const clearDateFilter = () => {
		setDateFilter({ startDate: null, endDate: null })
		startDateInputRef.current.value = ""
		endDateInputRef.current.value = ""
	}

	const pageHandleFunction = (e) => {
		const { selected } = e
		setPage(selected + 1)
	}

	if (isLoading) {
		return <div>Loading</div>
	}

	return (
		<div>
			<PageTitle title="처리 완료된 수리 내역" />
			<div className=" w-5/6  container ">
				{data && (
					<>
						<form
							onSubmit={onDateFilterHandler}
							className="flex justify-center w-full px-3"
						>
							<div className="w-full mr-3">
								<label className="input-label" htmlFor="date">
									시작 일자
								</label>
								<input
									className="input-text"
									id="date"
									type="date"
									ref={startDateInputRef}
								/>
							</div>
							<div className="w-full mr-3">
								<label className="input-label" htmlFor="date">
									종료 일자
								</label>
								<input
									className="input-text"
									id="date"
									type="date"
									ref={endDateInputRef}
								/>
							</div>
							<div className="mt-4 flex w-full">
								<button className="input-button w-full mr-2" type="submit">
									검색
								</button>
								<button
									className="input-button w-full"
									type="button"
									onClick={clearDateFilter}
								>
									초기화
								</button>
							</div>
						</form>

						<CompleteRepairTable data={data.repairs} />
						<PagenationUi
							onPageChange={pageHandleFunction}
							pageRangeDisplayed={maxPosts}
							pageCount={data.totalPosts}
						/>
					</>
				)}
			</div>
		</div>
	)
}

export default RepairLogPage
