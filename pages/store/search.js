import StoreSearchFilterForm from "../../components/store/search-filter-form"
import PageTitle from "../../components/ui/page-title"
import { updateStoreCreditCount } from "../../lib/util/product-util"

const StoreSearchPage = () => {
	const updateStoreCreditCountToUtil = async (body) => {
		const response = await updateStoreCreditCount(body)

		if (response.success) {
			return response
		} else {
			return
		}
	}

	return (
		<>
			<PageTitle title="가맹점 검색" />
			<StoreSearchFilterForm
				updateStoreCreditCount={updateStoreCreditCountToUtil}
			/>
		</>
	)
}

export default StoreSearchPage
