import { SessionProvider } from "next-auth/react"

import Layout from "../components/layout/layout"
import "../styles/globals.css"
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react"
import { api } from "../query/api"

const MyApp = ({ Component, pageProps }) => {
	return (
		<ApiProvider api={api}>
			<SessionProvider session={pageProps.session}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</ApiProvider>
	)
}

export default MyApp
