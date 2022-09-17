import mongoose, { Schema } from "mongoose"

export const brandSchema = new Schema(
	{
		name: {
			type: String,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema)
