import mongooseConnect from "@/lib/db/mongooseConnect"
import { ProductCompanyModel } from "@/models/ProductCompany"

export async function getProductCompanies() {
	try {
		await mongooseConnect()

		let editCompanies = []

		await ProductCompanyModel.find().then((data: any) => {
			data = JSON.parse(JSON.stringify(data))

			data.map((company) => {
				editCompanies.push({
					value: company.name,
				})
			})
		})

		return editCompanies
	} catch (e) {
		console.log(e)
	}
}
