import mongoose, { Schema } from "mongoose"

export const UserSchema = new Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},
		phoneNumber: {
			type: Number,
		},
		role: {
			// Admin, User
			type: String,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
