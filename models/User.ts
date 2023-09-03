import * as typegoose from "@typegoose/typegoose"

export class User {
	@typegoose.Prop({ type: String })
	public name: string

	@typegoose.Prop({ type: String })
	public email: string

	@typegoose.Prop({ type: String })
	public password: string

	@typegoose.Prop({ type: Number })
	public phoneNumber: number

	@typegoose.Prop({ type: String })
	public role: string
}

export const UserModel = typegoose.getModelForClass(User)

// import mongoose, { Model, model, models, Schema } from "mongoose"

// interface IUser {
// 	name: string
// 	email: string
// 	password: string
// 	phoneNumber: Number
// 	role: string
// }

// interface IUserModel extends Model<IUser> {}
// export const UserSchema = new Schema<IUser>(
// 	{
// 		name: {
// 			type: String,
// 		},
// 		email: {
// 			type: String,
// 		},
// 		password: {
// 			type: String,
// 		},
// 		phoneNumber: {
// 			type: Number,
// 		},
// 		role: {
// 			// Admin, User
// 			type: String,
// 		},
// 	},
// 	{ timestamps: true },
// )

// const User =
// 	mongoose.models?.User || model<IUser, IUserModel>("User", UserSchema)
// export { User }

// export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
// const Product =
// 	mongoose.models && "User" in mongoose.models
// 		? mongoose.models.User
// 		: mongoose.model("User", UserSchema)
// export default Product
