import { StoreModel } from "./../../../models/Store"
import { NextApiRequest, NextApiResponse } from "next"

import nextConnect from "next-connect"
import mongooseConnect from "@/lib/db/mongooseConnect"

const handler = nextConnect()

handler.get(async function (req: NextApiRequest, res: NextApiResponse) {
	await mongooseConnect()
	const { storeId } = req.query
	try {
		const findStore = await StoreModel.findById(storeId).exec()

		res.status(200).json({ store: findStore, success: true })
	} catch (e) {
		res.status(200).json({
			message: "가맹점 정보 가져오는 중 에러",
			error: e,
			success: false,
		})
	}
})

export default handler
