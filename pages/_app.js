import { SessionProvider, getSession } from "next-auth/react"
import Layout from "../components/layout/layout"
import "../styles/globals.css"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"
import Head from "next/head"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { ToastMessageComponent } from "../components/ui/toast-message"
import { toast } from "react-toastify"

const MyApp = ({ Component, pageProps }) => {
	const router = useRouter()

	useEffect(() => {
		getSession().then((session) => {
			if (!session) {
				router.replace(`${window.location.origin}/auth`)
			}
		})
		fetch("/api/server-status")
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					return
				}
				toast.error(res.message)
			})
	}, [router.pathname])
	return (
		<ApiProvider api={api}>
			<SessionProvider session={pageProps.session}>
				<Head>
					<title>웨이브포스 시흥영업팀</title>
					<link rel="icon" href="/favicon-96x96.png" />
				</Head>
				<ToastMessageComponent />
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ApiProvider>
	)
}

export default MyApp
