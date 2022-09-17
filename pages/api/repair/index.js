import nextConnect from "next-connect"
import Product from "../../../models/Product"
import ProductLog from "../../../models/ProductLog"
import Repair from "../../../models/Repair"

const handler = nextConnect()

handler.get(async function (req, res) {
	try {
		const findRepairListByState = await Repair.find({ state: req.query.state })
			.populate("product")
			.populate("user")
		res.status(200).json({ repairs: findRepairListByState, success: true })
	} catch (e) {
		res
			.status(200)
			.json({ message: "수리 정보 가져오는 중 에러", error: e, success: false })
	}
})

handler.post(async function (req, res) {
	const data = req.body

	try {
		if (data.brand.name === "없음") {
			// 법인건 아니면 수량조정 없이 그냥 저장
			const repair = new Repair(data)
			repair.save()
			res.status(201).json({ message: "수리 내역 저장 성공", success: true })
		} else {
			Product.findById(data.product).exec((err, result) => {
				if (result.qty - data.qty < 0) {
					res.status(200).json({
						message: `재고 수량이 부족합니다. 보유수량 : ${result.qty}`,
						success: false,
					})
				} else {
					// 법인 장비인 경우
					// 기존 재고에서 수리 들어가는 수량 빼기.
					result.qty = result.qty - data.qty
					result.save()

					// 수량변경 로그 데이터 남기기
					const logBody = {
						user: data.user,
						product: data.product,
						calc: "minus",
						quantity: Number(data.qty),
						note: "수리 접수로 인한 재고 감소",
					}

					const log = new ProductLog(logBody)
					log.save()

					const repair = new Repair(data)
					repair.save()
					res
						.status(201)
						.json({ message: "수리 내역 저장 성공", success: true })
				}
			})
		}
	} catch (e) {
		res
			.status(500)
			.json({ message: "수리 내역 저장 중 오류", err: e, success: false })
	}
})

handler.patch(async function (req, res) {
	const { state, id, product, qty, user } = req.body

	// 수리완료 처리
	if (state === "수리완료") {
		const findRepairByState = await Repair.findByIdAndUpdate(id, {
			$set: { state: state },
		})
		res.status(200).json({
			message: "상태 변경 성공",
			repair: findRepairByState,
			success: true,
		})
	} else {
		// 원복, 재고입고 : 재고 수량 조정
		await Repair.findByIdAndUpdate(id, {
			$set: { state: state },
		})

		Product.findById(product).exec((err, result) => {
			// 기존 재고 수량에 수리해서 돌아온 수량 증가.
			result.qty = result.qty + qty
			result.save()

			// 수량변경 로그 데이터
			const logBody = {
				user: user,
				product: product,
				calc: "plus",
				quantity: Number(qty),
				note: `${state}로 인한 재고 증가.`,
			}

			const log = new ProductLog(logBody)
			log.save()

			res
				.status(201)
				.json({ message: `${state} 상태 변경 완료.`, success: true })
		})
	}
})
export default handler
