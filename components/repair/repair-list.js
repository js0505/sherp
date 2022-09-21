import { useEffect, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import RepairCardItem from "./repair-item"
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
		<section className="container lg:w-4/5  flex flex-col w-full sm:flex-row sm:justify-between ">
			<div className="overflow-auto sm:h-[35rem] w-full p-2">
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
			<div className="overflow-auto sm:h-[35rem] w-full p-2">
				{confirmRepairList &&
					confirmRepairList.map((item) => (
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
		</section>
	)
}

export default RepairList
