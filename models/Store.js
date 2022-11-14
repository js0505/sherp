import mongoose, { Schema } from "mongoose"

export const StoreSchema = new Schema(
	{
		// 담당자
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		storeName: {
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
		product: {
			pos: { type: Boolean, default: false },
			kiosk: { type: Boolean, default: false },
			printer: { type: Boolean, default: false },
			cat: { type: Boolean, default: false },
			router: { type: Boolean, default: false },
		},

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
				year: { type: String },
				month: { type: String },
				count: { type: Number },
				cms: { type: Number },
				inOperation: { type: Boolean, default: true },
				// 영업 여부 매달 입력 해야 함
			},
		],
		asNote: [
			{
				date: { type: String },
				note: { type: String },
				writerName: { type: String },
			},
		],
		contractImg: [
			{
				url: { type: String },
			},
		],
		isBackup: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.Store || mongoose.model("Store", StoreSchema)
