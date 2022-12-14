import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"
import Store from "../../../models/Store"
const handler = nextConnect()

handler.patch(async function (req, res) {
	await dbConnect()

	const { storeId, year, month, count, cms, inOperation } = req.body

	try {
		const query = {
			$set: count
				? {
						"creditCount.$.count": count,
						"creditCount.$.inOperation": inOperation,
				  }
				: {
						"creditCount.$.cms": cms,
						"creditCount.$.inOperation": inOperation,
				  },
		}
		const filterdStore = await Store.updateOne(
			{
				_id: storeId,
				creditCount: { $elemMatch: { year, month } },
			},
			query,
		)

		// 등록되지 않은 연, 월에 데이터 입력 시 새로운 값 입력 시키기
		if (filterdStore.matchedCount === 0) {
			await Store.findByIdAndUpdate(
				{ _id: storeId },
				{
					$push: {
						creditCount: {
							year,
							month,
							cms,
							count,
							inOperation,
						},
					},
				},
			)

			res.status(200).json({
				success: true,
				message: "새로운 연, 월 데이터 생성",
			})
		} else {
			res.status(200).json({
				success: true,
				message: "업데이트 성공",
			})
		}
	} catch (e) {
		console.log(e)
		res.status(200).json({
			message: "거래 건수 저장 중 오류",
			success: false,
			error: e,
		})
	}
})

export default handler
