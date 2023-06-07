import * as typegoose from "@typegoose/typegoose"
import mongoose from "mongoose"
import { Product } from "./Product"
// - 처리자 (로그인 유저 _id)
// - 장비 (장비 _id)
// - 변동 옵션 : add, delete
// - 변동 수량
// - 비고
// - 시간

export class ProductLog {
	@typegoose.Prop({ type: String })
	public user: string

	@typegoose.Prop({ ref: () => Product })
	public product: typegoose.Ref<Product>

	@typegoose.Prop({ type: String })
	public calc: "plus" | "minus"

	@typegoose.Prop({ type: Number })
	public quantity: number

	@typegoose.Prop({ type: String })
	public note: string

	@typegoose.Prop({ type: String })
	public date: string
}

export const ProductLogModel = typegoose.getModelForClass(ProductLog)

// export interface IProductLog {
// 	user: string
// 	product: Schema.Types.ObjectId
// 	calc: string
// 	quantity: number
// 	note: string
// 	date: string
// }

// interface IProductLogModel extends Model<IProductLog> {}

// export const productLogSchema = new Schema(
// 	{
// 		user: {
// 			type: String,
// 		},
// 		product: {
// 			type: Schema.Types.ObjectId,
// 			ref: "Product",
// 		},
// 		calc: {
// 			type: String,
// 			// plus, minus
// 		},
// 		quantity: {
// 			type: Number,
// 		},
// 		note: {
// 			type: String,
// 		},
// 		date: {
// 			type: String,
// 		},
// 	},
// 	{ timestamps: true },
// )

// const ProductLog =
// 	mongoose.models.Product ||
// 	model<IProductLog, IProductLogModel>("ProductLog", productLogSchema)

// export { ProductLog }

// export default mongoose.models.ProductLog ||
// 	mongoose.model("ProductLog", productLogSchema)
