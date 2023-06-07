import mongooseConnect from "@/lib/db/mongooseConnect"
import { BrandModel } from "@/models/Brand"

export async function getBrands() {
	try {
		await mongooseConnect()

		let editBrands = []

		await BrandModel.find().then((data: any) => {
			data = JSON.parse(JSON.stringify(data))

			data.map((company) => {
				editBrands.push({
					value: company.name,
				})
			})
		})

		return editBrands
	} catch (e) {
		console.log(e)
	}
}
