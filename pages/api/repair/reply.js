import nextConnect from "next-connect"
import mongooseConnect from "../../../lib/db/mongooseConnect"
import { RepairModel } from "../../../models/Repair"


const handler = nextConnect()

handler.post(async function (req, res) {
	// 수리내역 글에 댓글 작성.

	const { repairId, writerName, date, note } = req.body

	await mongooseConnect()

	try {
		await RepairModel.findByIdAndUpdate(
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
		res.status(200).json({ success: true })
	} catch (e) {
		res
			.status(200)
			.json({ message: "댓글 저장 중 에러", error: e, success: false })
	}
})
export default handler
