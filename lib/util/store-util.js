import { api } from "../../query/api"

export const getFilteredStore = ({ filter }) => {
	const { data } = api.useGetFilteredStoresQuery({ filter })
	if (data) {
		if (!data.success) {
			alert(data.message)
			return
		}

		return data.filterdStore
	}
}
