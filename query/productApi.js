import { api } from "./api"

const productApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProductLog: builder.query({
			query: ({ page, maxPosts, startDate, endDate }) =>
				`product/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
		}),
		addProduct: builder.mutation({
			query: (body) => {
				return {
					url: "product",
					method: "POST",
					body,
				}
			},
		}),
		getFilteredProduct: builder.query({
			query: ({ van, name, category, brand }) => {
				return `product?van=${van}&name=${name}&category=${category}&brand=${brand}`
			},
			// providesTags: ["ProductList"],
		}),
	}),
})

export const {
	useGetProductLogQuery,
	useAddProductMutation,
	useLazyGetFilteredProductQuery,
} = productApi
