import { getModelForClass, Prop } from "@typegoose/typegoose"
import { Types } from "mongoose"
export class ProductCompany {
	@Prop({ type: String })
	public name: string
	@Prop({ type: String })
	public contact: string
	@Prop({ type: String })
	public address: string
	@Prop({ type: Types.ObjectId })
	public _id: Types.ObjectId
}

export const ProductCompanyModel = getModelForClass(ProductCompany)
// import mongoose, { model, Model, Schema, Types } from "mongoose"

// export interface IProductCompany {
// 	name: string
// 	contact: string
// 	address: string
// 	_id: Types.ObjectId
// }

// interface IProductCompanyModel extends Model<IProductCompany> {}

// export const productCompanySchema = new Schema(
// 	{
// 		name: {
// 			type: String,
// 		},
// 		contact: {
// 			type: String,
// 		},
// 		address: {
// 			type: String,
// 		},
// 	},
// 	{ timestamps: true },
// )

// const ProductCompany =
// 	mongoose.models.ProductCompany ||
// 	model<IProductCompany, IProductCompanyModel>(
// 		"ProductCompany",
// 		productCompanySchema,
// 	)

// export { ProductCompany }
