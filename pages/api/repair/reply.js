import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"
import Repair from "../../../models/Repair"

const handler = nextConnect()

handler.post(async function (req, res) {
	// 수리내역 글에 댓글 작성.

	const { repairId, writerName, date, note } = req.body

	await dbConnect()

	try {
		const reply = await Repair.findByIdAndUpdate(
			{ _id: repairId },
			{
				$push: {
					reply: {
						writerName,
						date,
						note,
					},
				},
			},
		)
		console.log(reply)
		res.status(200).json({ success: true })
	} catch (e) {
		res
			.status(200)
			.json({ message: "댓글 저장 중 에러", error: e, success: false })
	}
})
export default handler
