import { useEffect, useState } from "react"
import StoreRegisterForm from "../../components/store/register-form"
import PageTitle from "../../components/ui/page-title"

import { getAllUsers } from "../../lib/util/user-util"

const StoreRegisterPage = () => {
	const [users, setUsers] = useState()

	const getAllUsersToUtil = async () => {
		const users = await getAllUsers()
		setUsers(users)
	}

	useEffect(() => {
		getAllUsersToUtil()
	}, [])
	return (
		<>
			<PageTitle title="가맹점 등록" />
			<StoreRegisterForm users={users} />
		</>
	)
}

export default StoreRegisterPage
