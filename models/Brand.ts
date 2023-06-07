import * as typegoose from "@typegoose/typegoose"

export class Brand {
	@typegoose.Prop({ type: String })
	public name: string
}

export const BrandModel = typegoose.getModelForClass(Brand)

// import mongoose, { model, Model, Schema } from "mongoose"

// export interface IBrand {
// 	name: string
// }

// interface IBrandModel extends Model<IBrand> {}

// export const brandSchema = new Schema(
// 	{
// 		name: {
// 			type: String,
// 		},
// 	},
// 	{ timestamps: true },
// )

// const Brand =
// 	mongoose.models.Brand || model<IBrand, IBrandModel>("Brand", brandSchema)

// export { Brand }
