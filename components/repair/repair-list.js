import { useEffect, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import RepairCardItem from "./repair-card-item"
import { format, differenceInDays, parseISO } from "date-fns"

function RepairList(props) {
	const { state } = props
	const [repairList, setRepairList] = useState()
	const [confirmRepairList, setConfirmRepairList] = useState()

	async function getRepairProductListByState() {
		const { repairs } = await fetchHelperFunction(
			"GET",
			`/api/repair?state=${state}`,
		)

		if (state === "수리접수") {
			const today = new Date()
			const formattedToday = format(today, "yyyy-MM-dd")

			let normalItem = []
			let confirmItem = []
			repairs.forEach((item) => {
				let compareDate = differenceInDays(
					parseISO(formattedToday),
					parseISO(item.date),
				)

				if (compareDate > 6) {
					confirmItem.push(item)
				} else {
					normalItem.push(item)
				}
			})

			setRepairList(normalItem)
			setConfirmRepairList(confirmItem)
		} else if (state === "수리완료") {
			setRepairList(repairs)
			setConfirmRepairList()
		}
	}

	useEffect(() => {
		getRepairProductListByState()
	}, [state])

	return (
		<section className="container lg:w-full mt-8 lg:mt-0 flex flex-col w-full lg:flex-row lg:justify-evenly ">
			<div className="relative lg:h-[35rem] w-full lg:w-2/5 p-2 pb-5 pt-8 border border-gray-transparent rounded-lg shadow-md">
				<div className="absolute -top-3 left-7 bg-white text-lg px-2 ">
					최근 접수내역
				</div>
				<div className="overflow-auto h-full">
					{repairList &&
						repairList.map((item) => (
							<div key={item._id}>
								<>
									<RepairCardItem
										state={state}
										replaceListHandler={getRepairProductListByState}
										item={item}
									/>
								</>
							</div>
						))}
				</div>
			</div>

			{confirmRepairList && (
				<div className="relative mt-9 lg:mt-0 lg:h-[35rem] w-full lg:w-2/5 p-2 pb-5 pt-8 border border-gray-transparent rounded-lg shadow-md">
					<div className="absolute -top-3 left-7 bg-white text-lg px-2 ">
						1주일 이상 경과된 내역
					</div>
					<div className="overflow-auto h-full">
						{confirmRepairList.map((item) => (
							<div key={item._id}>
								<RepairCardItem
									state={state}
									replaceListHandler={getRepairProductListByState}
									item={item}
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	)
}

export default RepairList
