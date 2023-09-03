import * as typegoose from "@typegoose/typegoose"
import { Brand } from "./Brand"
import { ProductCompany } from "./ProductCompany"

export class Product {
	@typegoose.Prop({ type: String })
	public name: string

	@typegoose.Prop({ type: String })
	public van: string

	@typegoose.Prop({ type: String })
	public category: string

	@typegoose.Prop({ type: Number, default: 1 })
	public qty: number

	@typegoose.Prop({ ref: () => Brand })
	public brand: typegoose.Ref<Brand>

	@typegoose.Prop({ ref: () => ProductCompany })
	public productCompany: typegoose.Ref<ProductCompany>
}

export const ProductModel = typegoose.getModelForClass(Product)

// import mongoose, {
// 	model,
// 	Model,
// 	Document,
// 	PopulatedDoc,
// 	Schema,
// 	Types,
// 	ObjectId,
// } from "mongoose"
// import { IBrand } from "./Brand"
// import { IProductCompany } from "./ProductCompany"

// export interface IProduct {
// 	name: string
// 	van: string
// 	category: string
// 	qty: number
// 	brand: Types.ObjectId
// 	productCompany: Types.ObjectId
// 	_id: Types.ObjectId
// }

// interface IProductModel extends Model<IProduct> {}

// export const productSchema = new Schema(
// 	{
// 		name: {
// 			type: String,
// 		},
// 		van: {
// 			type: String,
// 		},
// 		category: {
// 			type: String,
// 		},
// 		qty: {
// 			type: Number,
// 			default: 1,
// 		},
// 		brand: {
// 			type: Schema.Types.ObjectId,
// 			ref: "brand",
// 		},
// 		productCompany: {
// 			type: Schema.Types.ObjectId,
// 			ref: "productcompany",
// 		},
// 	},
// 	{ timestamps: true },
// )

// const Product =
// 	mongoose.models.Product ||
// 	model<IProduct, IProductModel>("Product", productSchema)

// export { Product }
