import { api } from "./api"

const brandApi = api.injectEndpoints({
	endpoints: (builder) => ({
		addBrand: builder.mutation({
			query: (body) => {
				return {
					method: "POST",
					url: "brand",
					body,
				}
			},
		}),
	}),
})

export const { useAddBrandMutation } = brandApi
