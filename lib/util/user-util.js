// import { api } from "../../query/api"

// export async function getAllUsers() {
// 	const { data } = api.useGetAllItemsByUrlQuery({ url: "user" })

// 	if (data) {
// 		if (!data.success) {
// 			alert(data.message)
// 			return
// 		}

// 		let editedUsers = []
// 		if (data.users) {
// 			data.users.map((item) => {
// 				editedUsers.push({
// 					_id: item._id,
// 					name: item.name,
// 				})
// 			})
// 		}

// 		return editedUsers
// 	}
// }
