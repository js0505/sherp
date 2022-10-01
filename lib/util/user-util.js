import { fetchHelperFunction } from "../fetch/json-fetch-data"

export async function getAllUsers() {
	const { users, success } = await fetchHelperFunction("GET", "/api/user")

	if (!success) {
		alert(message)
		return
	}

	let editedUsers = []
	if (users) {
		users.map((item) => {
			editedUsers.push({
				_id: item._id,
				name: item.name,
			})
		})
	}

	return editedUsers
}
