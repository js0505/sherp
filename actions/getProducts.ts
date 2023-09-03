import { ProductCompanyModel } from "./../models/ProductCompany"
import mongooseConnect from "@/lib/db/mongooseConnect"
import { BrandModel } from "@/models/Brand"
import { ProductModel } from "@/models/Product"

export default async function getProducts() {
	try {
		await mongooseConnect()

		let editProducts = []

		await ProductModel.find()
			.populate({
				path: "productCompany",
				model: ProductCompanyModel,
			})
			.populate({ path: "brand", model: BrandModel })
			.orFail()
			.then((data: any) => {
				data = JSON.parse(JSON.stringify(data))

				data.map((product) => {
					editProducts.push({
						id: product._id,
						brand: product.brand.name,
						company: product.productCompany.name,
						companyId: product.productCompany._id,
						qty: product.qty,
						value:
							product.brand.name === "없음"
								? `${product.name} ${product.van === "없음" ? "" : product.van}`
								: `${product.brand.name} ${product.name} ${
										product.van === "없음" ? "" : product.van
								  }`,
					})
				})
			})

		return editProducts
	} catch (e: any) {
		console.log(e)
		return null
	}
}
