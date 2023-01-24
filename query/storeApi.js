import { api } from "./api"

const storeApi = api.injectEndpoints({
	endpoints: (builder) => ({
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
	useAddStoreMutation,
	useLazyGetFilteredStoresQuery,
	useUpdateStoreMutation,
	useUpdateStoreCreditCountMutation,
	useGetStoreByIdQuery,
	useAddStoreAsMutation,
} = storeApi
