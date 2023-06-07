import * as typegoose from "@typegoose/typegoose"

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
	@typegoose.Prop({ type: String })
	public user: string

	@typegoose.Prop({ type: String })
	public storeName: string

	@typegoose.Prop({ type: Number })
	public businessNum: number

	@typegoose.Prop({ type: String })
	public van: string

	@typegoose.Prop({ type: String })
	public vanId: string

	@typegoose.Prop({ type: String })
	public vanCode: string

	@typegoose.Prop({ type: String })
	public owner: string

	@typegoose.Prop({ type: String })
	public city: string

	@typegoose.Prop({ type: String })
	public address: string

	@typegoose.Prop({ type: String })
	public contact: string

	@typegoose.Prop({ type: Object })
	public product: ProductType

	@typegoose.Prop({ type: Number })
	public cms: number

	@typegoose.Prop({ type: String })
	public contractDate: string

	@typegoose.Prop({ type: String })
	public closeDate: string

	@typegoose.Prop({ type: String })
	public closeYear: string

	@typegoose.Prop({ type: String })
	public note: string

	@typegoose.Prop({ type: String })
	public inOperation: string

	@typegoose.Prop({ type: Array<CreditCountType> })
	public creditCount: CreditCountType[]

	@typegoose.Prop({ type: Array<ContractImgType> })
	public contractImg: ContractImgType[]

	@typegoose.Prop({ type: Boolean })
	public isBackup: boolean

	@typegoose.Prop({ type: Boolean })
	public isCorporation: boolean
}

export const StoreModel = typegoose.getModelForClass(Store)

// 	isBackup: boolean
// 	isCorporation: boolean

// export interface IStore {
// 	user: string
// 	storeName: string
// 	businessNum: Number
// 	van: string
// 	vanId: string
// 	vanCode: string
// 	owner: string
// 	city: string
// 	address: string
// 	contact: string
// 	product: {
// 		pos: boolean
// 		kiosk: boolean
// 		printer: boolean
// 		cat: boolean
// 		router: boolean
// 	}

// 	cms: number
// 	contractDate: string
// 	closeDate: string
// 	closeYear: string
// 	note: string
// 	inOperation: string
// 	creditCount: [
// 		{
// 			year: string
// 			month: string
// 			count: number
// 			cms: number
// 			inOperation: string
// 		},
// 	]
// 	asNote: [
// 		{
// 			date: string
// 			note: string
// 			writerName: string
// 		},
// 	]
// 	contractImg: [
// 		{
// 			url: string
// 		},
// 	]
// 	isBackup: boolean
// 	isCorporation: boolean
// }
// interface IStoreModel extends Model<IStore> {}
// export const StoreSchema = new Schema(
// 	{
// 		// 담당자
// 		user: {
// 			type: String,
// 			default: "",
// 		},
// 		storeName: {
// 			type: String,
// 			default: "",
// 		},
// 		businessNum: {
// 			type: Number,
// 		},
// 		van: {
// 			type: String,
// 			default: "",
// 		},
// 		vanId: {
// 			type: String,
// 			default: "",
// 		},
// 		vanCode: {
// 			type: String,
// 			default: "",
// 		},
// 		owner: {
// 			type: String,
// 			default: "",
// 		},
// 		city: {
// 			type: String,
// 			default: "",
// 		},
// 		address: {
// 			type: String,
// 			default: "",
// 		},
// 		contact: {
// 			type: String,
// 			default: "",
// 		},
// 		product: {
// 			pos: { type: Boolean, default: false },
// 			kiosk: { type: Boolean, default: false },
// 			printer: { type: Boolean, default: false },
// 			cat: { type: Boolean, default: false },
// 			router: { type: Boolean, default: false },
// 		},

// 		cms: {
// 			type: Number,
// 			default: 0,
// 		},
// 		contractDate: {
// 			type: String,
// 			default: "",
// 		},
// 		closeDate: {
// 			type: String,
// 			default: "",
// 		},
// 		closeYear: {
// 			type: String,
// 			default: "",
// 		},
// 		note: {
// 			type: String,
// 			default: "",
// 		},
// 		inOperation: { type: String, default: "" },
// 		creditCount: [
// 			{
// 				year: { type: String },
// 				month: { type: String },
// 				count: { type: Number },
// 				cms: { type: Number },
// 				inOperation: { type: String, default: "" },
// 			},
// 		],
// 		asNote: [
// 			{
// 				date: { type: String },
// 				note: { type: String },
// 				writerName: { type: String },
// 			},
// 		],
// 		contractImg: [
// 			{
// 				url: { type: String },
// 			},
// 		],
// 		isBackup: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		isCorporation: {
// 			type: Boolean,
// 			default: false,
// 		},
// 	},
// 	{ timestamps: true },
// )

// const Store =
// 	mongoose.models.Store || model<IStore, IStoreModel>("Store", StoreSchema)
// export { Store }
