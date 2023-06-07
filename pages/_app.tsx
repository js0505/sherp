import "../styles/globals.css"
import { SessionProvider, getSession } from "next-auth/react"
import Layout from "../components/Layout"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"
import Head from "next/head"
import { useEffect } from "react"
import { useRouter } from "next/router"
import ToastMessageProvider from "../providers/ToastMessageProvider"

const MyApp = ({ Component, pageProps }) => {
	const router = useRouter()

	useEffect(() => {
		getSession().then((session) => {
			if (!session) {
				router.replace(`${window.location.origin}/auth`)
			}
		})
	}, [])
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
