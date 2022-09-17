import mongoose, { Schema } from "mongoose"

export const productCompanySchema = new Schema(
	{
		name: {
			type: String,
		},
		contact: {
			type: String,
		},
		address: {
			type: String,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.ProductCompany ||
	mongoose.model("ProductCompany", productCompanySchema)
