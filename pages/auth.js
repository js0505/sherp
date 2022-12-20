import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import AuthForm from "../components/auth/auth-form"

const AuthPage = () => {
	const router = useRouter()

	useEffect(() => {
		getSession().then((session) => {
			if (!session) {
				router.replace(`${window.location.origin}/auth`)
			} else {
				router.replace(`${window.location.origin}/`)
			}
		})
	}, [router])
	return <AuthForm />
}

export default AuthPage
