import {
	addModelToTypegoose,
	buildSchema,
	getModelForClass,
	getName,
	Prop,
	PropType,
	Severity,
} from "@typegoose/typegoose"
import mongoose from "mongoose"

interface ProductType {
	pos: boolean
	kiosk: boolean
	printer: boolean
	cat: boolean
	router: boolean
}

interface CreditCountType {
	year: string
	month: string
	count: number
	cms: number
	inOperation: string
}
interface ContractImgType {
	url: string
}

export class Store {
	public _id?: any
	@Prop({ type: String })
	public user: string

	@Prop({ type: String })
	public storeName: string

	@Prop({ type: Number })
	public businessNum: number

	@Prop({ type: String })
	public van: string

	@Prop({ type: String })
	public vanId: string

	@Prop({ type: String })
	public vanCode: string

	@Prop({ type: String })
	public owner: string

	@Prop({ type: String })
	public city: string

	@Prop({ type: String })
	public address: string

	@Prop({ type: String })
	public contact: string

	// type을 커스텀 타입을 지정하고 싶은데 지정이 안되서 allowMixed 옵션으로 다양한 타입 저장 되도록 지정.
	@Prop({ allowMixed: Severity.ALLOW, type: Object })
	public product: ProductType

	@Prop({ type: Number })
	public cms: number

	@Prop({ type: String })
	public contractDate: string

	@Prop({ type: String })
	public closeDate: string

	@Prop({ type: String })
	public closeYear: string

	@Prop({ type: String })
	public note: string

	@Prop({ type: String })
	public inOperation: string

	@Prop({ type: Array<CreditCountType> })
	public creditCount: CreditCountType[]

	@Prop({ type: Array<ContractImgType> })
	public contractImg: ContractImgType[]

	@Prop({ type: Boolean })
	public isBackup: boolean

	@Prop({ type: Boolean })
	public isCorporation: boolean
}

export const StoreModel = getModelForClass(Store)
// export const StoreSchema = buildSchema(Store)
// const StoreModelRaw = mongoose.model(getName(Store), StoreSchema)
// export const StoreModel =
// 	mongoose.models.store || addModelToTypegoose(StoreModelRaw, Store)
