import { UserModel } from "./../models/User"
import mongooseConnect from "@/lib/db/mongooseConnect"

export default async function getUsersList() {
	try {
		await mongooseConnect()
		const users = await UserModel.find({})

		let userName = []
		users.map((user) => userName.push({ value: user.name, name: user.name }))

		return userName
	} catch (e: any) {
		return null
	}
}
