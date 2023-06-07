import { api } from "./api"

const repairApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getRepairLog: builder.query({
			query: ({ page, maxPosts, storeName, productNum }) => {
				return `repair/log?page=${page}&maxPosts=${maxPosts}&storeName=${storeName}&productNum=${productNum}`
			},
		}),
		getRepairListByState: builder.query({
			query: ({ state }) => {
				return `repair?state=${state}`
			},
			providesTags: ["RepairList"],
		}),
		addRepairItem: builder.mutation({
			query: ({ body }) => {
				return {
					url: "repair",
					method: "POST",
					body,
				}
			},
			invalidatesTags: ["RepairList"],
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
			invalidatesTags: ["RepairItem", "RepairList"],
		}),
	}),
})

export const {
	useGetRepairLogQuery,
	useGetRepairListByStateQuery,
	useAddRepairItemMutation,
	useSetRepairListStateMutation,
	useGetRepairItemByIdQuery,
	useSetRepairReplyMutation,
} = repairApi
