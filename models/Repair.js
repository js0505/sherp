import mongoose, { Schema } from "mongoose"

export const RepairSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
		},

		productCompany: {
			type: Schema.Types.ObjectId,
			ref: "ProductCompany",
		},
		qty: {
			type: Number,
		},
		storeName: {
			type: String,
		},
		productNum: {
			type: String,
		},
		invoiceNum: {
			type: String,
		},
		note: {
			type: String,
		},
		symptom: {
			type: String,
		},
		date: {
			type: String,
		},
		isStock: {
			type: Boolean,
			default: false,
		},
		state: {
			type: String,
			default: "수리접수",
			// 수리접수, 수리완료, 원복완료, 재고입고
		},
		reply: [
			{
				writerName: { type: String },
				date: { type: String },
				note: { type: String },
			},
		],
	},
	{ timestamps: true },
)

export default mongoose.models.Repair || mongoose.model("Repair", RepairSchema)
