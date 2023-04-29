import { useRouter } from "next/router"
import PageTitle from "../../components/ui/page-title"
import RepairCardItem from "../../components/repair/RepairCardItem"
import { useGetRepairListByStateQuery } from "../../query/repairApi"
import { getRepairProductListByState } from "../../lib/util/repair-util"

function RepairListPage() {
	const router = useRouter()
	const { state } = router.query

	let title
	if (state === "수리접수") {
		title = "수리 접수된 장비"
	} else if (state === "수리완료") {
		title = "수리 완료된 장비"
	}

	const { data } = useGetRepairListByStateQuery({ state })

	const items = getRepairProductListByState({
		repairs: data ? data.repairs : undefined,
		state,
	})
	const repairList = items ? items[0] : undefined
	const confirmRepairList = items ? items[1] : undefined

	return (
		<>
			<PageTitle title={title} />
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
		</>
	)
}

export default RepairListPage
