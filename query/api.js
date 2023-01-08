import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
	tagTypes: [
		"RepairList",
		"RepairItem",
		"StoreDetail",
		"StoreList",
		"ProductList",
	],
	endpoints: (builder) => ({
		getAllItemsByUrl: builder.query({
			query: ({ url }) => url,
		}),
		plainFetcher: builder.mutation({
			query: ({ url, body, method }) => ({
				url,
				body,
				method,
			}),
		}),

		/**
		 * Repairs
		 */

		getRepairLog: builder.query({
			query: ({ page, maxPosts, startDate, endDate }) =>
				`repair/log?page=${page}&maxPosts=${maxPosts}&start=${startDate}&end=${endDate}`,
		}),
		getRepairListByState: builder.query({
			query: ({ state }) => `repair?state=${state}`,
			providesTags: ["RepairList"],
		}),
		setRepairListState: builder.mutation({
			query: ({ body }) => {
				return {
					url: "repair",
					method: "PATCH",
					body,
				}
			},
			invalidatesTags: ["RepairList"],
		}),
		getRepairItemById: builder.query({
			query: ({ repairId }) => `repair/${repairId}`,
			providesTags: ["RepairItem"],
		}),
		setRepairReply: builder.mutation({
			query: ({ body }) => {
				return {
					url: "repair/reply",
					method: "POST",
					body,
				}
			},
			invalidatesTags: ["RepairItem"],
		}),

		/**
		 * Products
		 */

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

		/**
		 * Stores
		 */

		getFilteredStores: builder.query({
			query: ({ businessNum, storeName, van, city, user }) => {
				return `store?businessNum=${businessNum}&storeName=${storeName}&van=${van}&city=${city}&user=${user}`
			},
			providesTags: ["StoreList"],
		}),
		getStoreById: builder.query({
			query: ({ storeId }) => `store/${storeId}`,
			providesTags: ["StoreDetail"],
		}),
		addStore: builder.mutation({
			query: (body) => {
				return {
					url: "store",
					method: "POST",
					body,
				}
			},
		}),
		addStoreAs: builder.mutation({
			query: (body) => {
				return {
					url: "store/as",
					method: "POST",
					body,
				}
			},
			invalidatesTags: ["StoreDetail"],
		}),
		updateStore: builder.mutation({
			query: (body) => {
				return {
					url: "store",
					method: "PATCH",
					body,
				}
			},
			invalidatesTags: ["StoreDetail", "StoreList"],
		}),
		updateStoreCreditCount: builder.mutation({
			query: (body) => {
				return {
					url: "store/creditcount",
					method: "PATCH",
					body,
				}
			},
			invalidatesTags: ["StoreList"],
		}),
	}),
})

export const {
	useGetAllItemsByUrlQuery,
	usePlainFetcherMutation,
	/**
	 * Products
	 */
	useGetProductLogQuery,
	useAddProductMutation,
	useLazyGetFilteredProductQuery,
	/**
	 * Repairs
	 */
	useGetRepairLogQuery,
	useGetRepairListByStateQuery,
	useSetRepairListStateMutation,
	useGetRepairItemByIdQuery,
	useSetRepairReplyMutation,
	/**
	 * Stores
	 */
	useAddStoreMutation,
	useLazyGetFilteredStoresQuery,
	useUpdateStoreMutation,
	useUpdateStoreCreditCountMutation,
	useGetStoreByIdQuery,
	useAddStoreAsMutation,
} = api
