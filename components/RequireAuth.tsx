import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

const RequireAuth = ({ children }) => {
	const { data: session, status } = useSession()
	console.log(session)
	const { push } = useRouter()

	useEffect(() => {
		if (session === null || status === "unauthenticated") {
			alert("로그인이 필요합니다.")
			push("/auth")
		}
	}, [session])

	if (status === "loading") {
		return <p>Loading...</p>
	}

	return children
}

export default RequireAuth
