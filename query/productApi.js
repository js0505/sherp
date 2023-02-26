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
			providesTags: ["ProductQty"],
		}),
		getAllProductsForComboBox: builder.query({
			query: () => "product",
			transformResponse: (respose) => {
				const { products } = respose

				let editedProductList = []
				if (products) {
					products.map((item) =>
						editedProductList.push({
							value: item._id,
							brand: item.brand,
							company: item.productCompany.name,
							companyId: item.productCompany._id,
							qty: item.qty,
							name:
								item.brand.name === "없음"
									? `${item.name} ${item.van === "없음" ? "" : item.van}`
									: `${item.brand.name} ${item.name} ${
											item.van === "없음" ? "" : item.van
									  }`,
						}),
					)
				}

				return editedProductList
			},
			providesTags: ["ProductQty"],
		}),
		updateProductQty: builder.mutation({
			query: (body) => {
				return {
					url: "qty",
					method: "PATCH",
					body,
				}
			},
			invalidatesTags: ["ProductQty"],
		}),
	}),
})

export const {
	useGetProductLogQuery,
	useAddProductMutation,
	useLazyGetFilteredProductQuery,
	useGetAllProductsForComboBoxQuery,
	useUpdateProductQtyMutation,
} = productApi
