import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function useCheckSession() {
	const { push } = useRouter()
	const { data: session } = useSession()
	useEffect(() => {
		if (!session.user) {
			alert("로그인이 필요합니다.")
			push("/auth")
		}
	}, [session])
	return session
}
