import { useRouter } from "next/router"
import RepairList from "../../../components/repair/list"
import PageTitle from "../../../components/ui/page-title"

function RepairListPage() {
	const router = useRouter()
	const { state } = router.query

	let title
	if (state === "수리접수") {
		title = "수리 접수된 장비"
	} else if (state === "수리완료") {
		title = "수리 완료된 장비"
	}
	return (
		<>
			<PageTitle title={title} />
			<div className="">
				<RepairList state={state} />
			</div>
		</>
	)
}

export default RepairListPage
