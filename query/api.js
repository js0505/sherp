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
	}),
})

export const {
	useGetAllItemsByUrlQuery,
	useLazyGetAllItemsByUrlQuery,
	usePlainFetcherMutation,
} = api
