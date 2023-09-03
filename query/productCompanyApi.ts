import { api } from "./api"

const productCompanyApi = api.injectEndpoints({
	endpoints: (builder) => ({
		addProductCompany: builder.mutation({
			query: (body) => {
				return {
					method: "POST",
					url: "company",
					body,
				}
			},
		}),
	}),
})

export const { useAddProductCompanyMutation } = productCompanyApi
