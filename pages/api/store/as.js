import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"
import Store from "../../../models/Store"

const handler = nextConnect()

// 사업자번호, 상호명으로 필터링 된 데이터 전달
handler.post(async function (req, res) {
	const { storeId, date, note, writerName } = req.body

	await dbConnect()

	try {
		await Store.findByIdAndUpdate(
			{ _id: storeId },
			{
				$push: {
					asNote: {
						writerName,
						date,
						note,
					},
				},
			},
		)

		res.status(200).json({ success: true, message: "수리내역 저장 성공" })
	} catch (e) {
		console.log(e)
		res
			.status(200)
			.json({ message: "수리내역 저장 중 에러", error: e, success: false })
	}
})

export default handler
