import nextConnect from "next-connect"
import dbConnect from "../../lib/mongoose/dbConnect"
import User from "../../models/User"
const handler = nextConnect()

handler.get(async function (req, res) {
	try {
		await dbConnect()
		const users = await User.find({}).exec()

		res.status(200).json({ success: true, users })
	} catch (e) {
		res
			.status(200)
			.json({ success: false, message: "유저 정보 가져오는 중 에러", error: e })
	}
})
export default handler
