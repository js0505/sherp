import { api } from "./api"

const repairApi = api.injectEndpoints({
	endpoints: (builder) => ({
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
	}),
})

export const {
	useGetRepairLogQuery,
	useGetRepairListByStateQuery,
	useSetRepairListStateMutation,
	useGetRepairItemByIdQuery,
	useSetRepairReplyMutation,
} = repairApi
