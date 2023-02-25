import mongoose, { Schema } from "mongoose"

export const productLogSchema = new Schema(
	{
		user: {
			type: String,
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
		},
		calc: {
			type: String,
			// plus, minus
		},
		quantity: {
			type: Number,
		},
		note: {
			type: String,
		},
		date: {
			type: String,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.ProductLog ||
	mongoose.model("ProductLog", productLogSchema)
// - 처리자 (로그인 유저 _id)
// - 장비 (장비 _id)
// - 변동 옵션 : add, delete
// - 변동 수량
// - 비고
// - 시간
