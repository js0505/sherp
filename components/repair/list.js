import RepairCardItem from "./card-item"
import { api } from "../../query/api"
import { getRepairProductListByState } from "../../lib/util/repair-util"

function RepairList(props) {
	const { state } = props
	const { data } = api.useGetRepairListByStateQuery({ state })

	const items = getRepairProductListByState({
		repairs: data ? data.repairs : undefined,
		state,
	})
	const repairList = items ? items[0] : undefined
	const confirmRepairList = items ? items[1] : undefined

	return (
		<section className="container lg:w-full mt-8 lg:mt-0 flex flex-col w-full lg:flex-row lg:justify-evenly ">
			<div
				className="relative lg:h-70vh w-full lg:w-2/5 p-2 pb-5 pt-8 
							border border-gray-transparent rounded-lg shadow-md"
			>
				<div className="absolute -top-3 left-7 bg-white text-lg px-2 ">
					최근 접수내역
				</div>
				<div className="overflow-auto h-full">
					{repairList &&
						repairList.map((item) => (
							<div key={item._id}>
								<RepairCardItem state={state} item={item} />
							</div>
						))}
				</div>
			</div>

			{confirmRepairList && (
				<div
					className="relative mt-9 lg:mt-0 lg:h-70vh w-full lg:w-2/5 p-2 pb-5 pt-8 
								border border-gray-transparent rounded-lg shadow-md"
				>
					<div className="absolute -top-3 left-7 bg-white text-lg px-2 ">
						1주일 이상 경과된 내역
					</div>
					<div className="overflow-auto h-full">
						{confirmRepairList.map((item) => (
							<div key={item._id}>
								<RepairCardItem state={state} item={item} />
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	)
}

export default RepairList
