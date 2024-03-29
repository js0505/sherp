import nextConnect from "next-connect"
import { ProductModel } from "../../../models/Product"
import { ProductLogModel } from "../../../models/ProductLog"
import mongooseConnect from "../../../lib/db/mongooseConnect"
import { RepairModel } from "../../../models/Repair"
import { BrandModel } from "../../../models/Brand"

const handler = nextConnect()

handler.get(async function (req, res) {
	await mongooseConnect()

	try {
		const findRepairListByState = await RepairModel.find({
			state: req.query.state,
		})
			.populate({ path: "product", model: ProductModel })
			.exec()

		res.status(200).json({ repairs: findRepairListByState, success: true })
	} catch (e) {
		res
			.status(200)
			.json({ message: "수리 정보 가져오는 중 에러", error: e, success: false })
	}
})

handler.post(async function (req, res) {
	await mongooseConnect()
	const data = req.body

	try {
		const repair = new RepairModel(data)
		repair.save()
		res.status(201).json({ message: "수리 내역 저장 성공", success: true })

		// 하단 주석 내용은 법인 장비 여부에 따라 재고 및 로그용 로직.

		// if (data.brand.name === "없음") {
		// 	// 법인건 아니면 수량조정 없이 그냥 저장
		// 	const repair = new RepairModel(data)
		// 	repair.save()
		// 	res.status(201).json({ message: "수리 내역 저장 성공", success: true })
		// } else {
		// 	const result = await ProductModel.findById(data.product)
		// 		.populate({ path: "brand", model: BrandModel })
		// 		.exec()
		// 	if (result.qty - data.qty < 0) {
		// 		res.status(200).json({
		// 			message: `재고 수량이 부족합니다. 보유수량 : ${result.qty}`,
		// 			success: false,
		// 		})
		// 	} else {
		// 		// 법인 장비인 경우
		// 		// 기존 재고에서 수리 들어가는 수량 빼기.
		// 		result.qty = result.qty - data.qty
		// 		result.save()

		// 		// 수량변경 로그 데이터 남기기
		// 		const logBody = {
		// 			user: data.user,
		// 			product: data.product,
		// 			calc: "minus",
		// 			quantity: Number(data.qty),
		// 			note: "수리 접수로 인한 재고 감소",
		// 			date: data.date,
		// 		}

		// 		const log = new ProductLogModel(logBody)
		// 		log.save()

		// 		const repair = new RepairModel(data)
		// 		repair.save()
		// 		res.status(201).json({ message: "수리 내역 저장 성공", success: true })
		// 	}
		// }
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "수리 내역 저장 중 오류", err: e, success: false })
	}
})

handler.patch(async function (req, res) {
	// 입고된 장비 상태 업데이트 하는 부분.
	// 수리 입고 -> 완료는 그냥 상태만 변경
	// 수리완료 -> 재고 or 원복은 재고 수량변경, 로그남기기, 최종 변경 날짜, 유저 입력

	try {
		await mongooseConnect()
		const { state, id, product, qty, completeUser, completeDate } = req.body

		// 수리완료 처리
		if (state === "수리완료") {
			const findRepairByState = await RepairModel.findByIdAndUpdate(id, {
				$set: { state: state },
			})
			res.status(200).json({
				message: "상태 변경 성공",
				repair: findRepairByState,
				success: true,
			})
		} else {
			// 원복, 재고입고 : 재고 수량 조정
			await RepairModel.findByIdAndUpdate(id, {
				$set: {
					state: state,
					completeUser: completeUser,
					completeDate: completeDate,
				},
			})

			ProductModel.findById(product)
				.populate({ path: "brand", model: BrandModel })
				.then((result) => {
					// 기존 재고 수량에 수리해서 돌아온 수량 증가.

					// 법인장비 아닐 때만 수량조정, 로그 입력
					if (result.brand.name !== "없음") {
						result.qty = result.qty + qty
						result.save()

						// 수량변경 로그 데이터
						const logBody = {
							user: completeUser,
							product: product,
							calc: "plus",
							quantity: Number(qty),
							note: `${state}로 인한 재고 증가.`,
							date: completeDate,
						}

						const log = new ProductLogModel(logBody)
						log.save()
					}

					res
						.status(201)
						.json({ message: `${state} 상태 변경 완료.`, success: true })
				})
		}
	} catch (e) {
		console.log(e)
		res.status(400).json({ message: `상태 변경 중 에러.`, success: false })
	}
})
export default handler
