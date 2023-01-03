import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
	tagTypes: ["RepairList", "RepairItem"],
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
	}),
})

export const {
	useGetProductLogQuery,
	useGetRepairLogQuery,
	useGetRepairListByStateQuery,
	useSetRepairListStateMutation,
	useGetRepairItemByIdQuery,
	useSetRepairReplyMutation,
	useGetAllItemsByUrlQuery,
	usePlainFetcherMutation,
	useAddProductMutation,
} = api
