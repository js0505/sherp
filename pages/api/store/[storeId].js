import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

// storeId로 개별 가맹점 정보 api

handler.get(async function (req, res) {
	const { storeId } = req.query
	await dbConnect()

	console.log(storeId)
	try {
	} catch (e) {
		console.log(e)
		res.status(200).json({
			message: "가맹점 정보 가져오는 중 에러 발생",
			success: false,
			error: e,
		})
	}
})

export default handler
