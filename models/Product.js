import mongoose, { Schema } from "mongoose"

export const productSchema = new Schema(
	{
		name: {
			type: String,
		},
		van: {
			type: String,
		},
		category: {
			type: String,
		},
		qty: {
			type: Number,
			default: 1,
		},
		brand: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
		},
		productCompany: {
			type: Schema.Types.ObjectId,
			ref: "ProductCompany",
		},
	},
	{ timestamps: true },
)

export default mongoose.models.Product ||
	mongoose.model("Product", productSchema)
