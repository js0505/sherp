import { useEffect, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import RepairCardItem from "./repair-item"

function RepairList(props) {
	const { state } = props
	const [repairList, setRepairList] = useState()

	async function getRepairProductListByState() {
		const { repairs } = await fetchHelperFunction(
			"GET",
			`/api/repair?state=${state}`,
		)
		setRepairList(repairs)
	}

	useEffect(() => {
		getRepairProductListByState()
	}, [state])

	return (
		<section className="container lg:w-3/5 ">
			<div className="overflow-auto sm:h-[35rem]">
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
		</section>
	)
}

export default RepairList
