import mongoose, { Schema } from "mongoose"

//
// ClosedStore 모델이랑 항상 같아야 함. 변경되면 꼭 똑같이 맞춰둘 것
//

export const StoreSchema = new Schema(
	{
		// 담당자
		user: {
			type: String,
			default: "",
		},
		storeName: {
			type: String,
			default: "",
		},
		businessNum: {
			type: Number,
		},
		van: {
			type: String,
			default: "",
		},
		vanId: {
			type: String,
			default: "",
		},
		vanCode: {
			type: String,
			default: "",
		},
		owner: {
			type: String,
			default: "",
		},
		city: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
		contact: {
			type: String,
			default: "",
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
			default: 0,
		},
		contractDate: {
			type: String,
			default: "",
		},
		closeDate: {
			type: String,
			default: "",
		},
		closeYear: {
			type: String,
			default: "",
		},
		note: {
			type: String,
			default: "",
		},
		inOperation: { type: String, default: "" },
		creditCount: [
			{
				year: { type: String },
				month: { type: String },
				count: { type: Number },
				cms: { type: Number },
				inOperation: { type: String, default: "" },
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
