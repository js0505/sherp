"use client"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"
export default function ReduxApiProvider({ children }) {
	return <ApiProvider api={api}> {children}</ApiProvider>
}
