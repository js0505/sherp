import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import Layout from "../components/Layout"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"
import Head from "next/head"
import ToastMessageProvider from "../providers/ToastMessageProvider"

const MyApp = ({ Component, pageProps }) => {
	return (
		<ApiProvider api={api}>
			<SessionProvider session={pageProps.session}>
				<ToastMessageProvider />
				<Head>
					<title>웨이브포스 시흥영업팀</title>
					<link rel="icon" href="/favicon-96x96.png" />
				</Head>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ApiProvider>
	)
}

export default MyApp
