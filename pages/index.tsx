import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"

const Home = () => {
	const [isLoading, setIsLoading] = useState(true)

	const router = useRouter()

	useEffect(() => {
		setIsLoading(true)
		getSession().then((session) => {
			if (!session) {
				router.replace(`${window.location.origin}/auth`)
				setIsLoading(false)
			} else {
				setIsLoading(false)
			}
		})
	}, [router])

	return <>{isLoading && <Loader />}</>
}

export default Home
