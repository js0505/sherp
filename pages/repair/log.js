import { useRef, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import CompleteRepairTable from "../../components/repair/log/repair-log"
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
			<div className=" lg:w-5/6 w-full  container ">
				{data && (
					<>
						<form
							onSubmit={onDateFilterHandler}
							className="flex w-full flex-col
							lg:justify-center lg:px-3 lg:flex-row"
						>
							<div className="flex lg:w-full">
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
								<div className="w-full lg:mr-3">
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
							</div>
							<div className="mt-4 flex w-full lg:w-1/2">
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
