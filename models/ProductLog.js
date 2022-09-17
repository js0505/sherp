import mongoose, { Schema } from "mongoose"

export const productLogSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
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
