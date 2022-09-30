import mongoose, { Schema } from "mongoose"

export const StoreSchema = new Schema(
	{
		// 담당자
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		name: {
			type: String,
		},
		businessNum: {
			type: String,
		},
		van: {
			type: String,
		},
		vanId: {
			type: String,
		},
		vanCode: {
			type: String,
		},
		owner: {
			type: String,
		},
		city: {
			type: String,
		},
		address: {
			type: String,
		},
		contact: {
			type: String,
		},
		product: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		cms: {
			type: Number,
		},
		contractDate: {
			type: String,
		},
		closeDate: {
			type: String,
		},
		note: {
			type: String,
		},
		creditCount: [
			{
				yearMonth: { type: String },
				count: { type: Number },
			},
		],
		asNote: [
			{
				date: { type: String },
				note: { type: String },
			},
		],
		contract: [
			{
				url: { type: String },
			},
		],
	},
	{ timestamps: true },
)

export default mongoose.models.Store || mongoose.model("Store", StoreSchema)
