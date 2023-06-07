import * as typegoose from "@typegoose/typegoose"

import { Product } from "./Product"
import { ProductCompany } from "./ProductCompany"

interface RepairReplyType {
	writerName: string
	date: string
	note: string
}

export class Repair {
	@typegoose.Prop({ type: String })
	public user: string

	@typegoose.Prop({ ref: "Product" })
	public product: typegoose.Ref<Product>

	@typegoose.Prop({ ref: () => ProductCompany })
	public productCompany: typegoose.Ref<ProductCompany>

	@typegoose.Prop({ type: Number })
	public qty: number

	@typegoose.Prop({ type: String })
	public storeName: string

	@typegoose.Prop({ type: String })
	public productNum: string

	@typegoose.Prop({ type: String })
	public invoiceNum: string

	@typegoose.Prop({ type: String })
	public note: string

	@typegoose.Prop({ type: String })
	public symptom: string

	@typegoose.Prop({ type: String })
	public date: string

	@typegoose.Prop({ type: Boolean, default: false })
	public isStock: boolean

	@typegoose.Prop({ type: String, default: "수리접수" })
	public state: "수리접수" | "수리완료" | "원복완료" | "재고입고"

	@typegoose.Prop({ type: String })
	public completeUser: string

	@typegoose.Prop({ type: String })
	public completeDate: string

	@typegoose.Prop({ type: Array<RepairReplyType> })
	public reply: RepairReplyType[]
}

export const RepairModel = typegoose.getModelForClass(Repair)

// export interface IRepair {
// 	_id: string
// 	user: string
// 	product: Schema.Types.ObjectId
// 	productCompany: Schema.Types.ObjectId
// 	qty: number
// 	storeName: string
// 	productNum: string
// 	invoiceNum: string
// 	note: string
// 	symptom: string
// 	date: string
// 	isStock: boolean
// 	state: "수리접수" | "수리완료" | "원복완료" | "재고입고"
// 	completeUser: string
// 	completeDate: string
// 	reply: [
// 		{
// 			writerName: string
// 			date: string
// 			note: string
// 		},
// 	]
// }
// export interface IRepairModel extends Model<IRepair> {}
// export const RepairSchema = new Schema(
// 	{
// 		user: {
// 			type: String,
// 		},
// 		product: {
// 			type: Schema.Types.ObjectId,
// 			ref: "Product",
// 		},

// 		productCompany: {
// 			type: Schema.Types.ObjectId,
// 			ref: "ProductCompany",
// 		},
// 		qty: {
// 			type: Number,
// 		},
// 		storeName: {
// 			type: String,
// 		},
// 		productNum: {
// 			type: String,
// 		},
// 		invoiceNum: {
// 			type: String,
// 		},
// 		note: {
// 			type: String,
// 		},
// 		symptom: {
// 			type: String,
// 		},
// 		date: {
// 			type: String,
// 		},
// 		isStock: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		state: {
// 			type: String,
// 			default: "수리접수",
// 			// 수리접수, 수리완료, 원복완료, 재고입고
// 		},
// 		completeUser: {
// 			type: String,
// 		},
// 		completeDate: {
// 			type: String,
// 		},
// 		reply: [
// 			{
// 				writerName: { type: String },
// 				date: { type: String },
// 				note: { type: String },
// 			},
// 		],
// 	},
// 	{ timestamps: true },
// )

// const Repair =
// 	mongoose.models.Repair || model<IRepair, IRepairModel>("Repair", RepairSchema)

// export { Repair }
