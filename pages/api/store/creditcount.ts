import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import mongooseConnect from "../../../lib/db/mongooseConnect"
import { StoreModel } from "../../../models/Store"

const handler = nextConnect()

handler.patch(async function (req: NextApiRequest, res: NextApiResponse) {
	await mongooseConnect()

	const { storeId, year, month, count, cms, inOperation } = req.body

	try {
		const query = {
			$set: {
				"creditCount.$.count": count,
				"creditCount.$.inOperation": inOperation,
				"creditCount.$.cms": cms,
			},
		}
		const filterdStore = await StoreModel.updateOne(
			{
				_id: storeId,
				creditCount: { $elemMatch: { year, month } },
			},
			query,
		)

		// 등록되지 않은 연, 월에 데이터 입력 시 새로운 값 입력 시키기
		if (filterdStore.matchedCount === 0) {
			const store = await StoreModel.findByIdAndUpdate(
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
				{ new: true },
			).lean()

			res.status(200).json({
				success: true,
				message: "새로운 연, 월 데이터 생성완료",
				updatedStore: store,
			})
			return
		}

		// api 테스트에서 참고 하려고 새로 리턴.
		const updatedStore = await StoreModel.findById(storeId).lean()

		res.status(200).json({
			success: true,
			message: "업데이트 성공",
			updatedStore,
		})
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
