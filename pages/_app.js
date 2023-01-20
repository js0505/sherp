import { SessionProvider } from "next-auth/react"

import Layout from "../components/layout/layout"
import "../styles/globals.css"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"
import Head from "next/head"

const MyApp = ({ Component, pageProps }) => {
	return (
		<ApiProvider api={api}>
			<SessionProvider session={pageProps.session}>
				<Head>
					<title>웨이브포스 시흥영업팀</title>
				</Head>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ApiProvider>
	)
}

export default MyApp
