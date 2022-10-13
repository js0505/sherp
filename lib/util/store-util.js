import { fetchHelperFunction } from "../fetch/json-fetch-data"

export async function getFilteredStore(filter) {
	const { filterdStore, success, message } = await fetchHelperFunction(
		"GET",
		`/api/store?filter=${filter}`,
	)

	if (!success) {
		alert(message)
		return
	}

	return filterdStore
}
