import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

function Home() {
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		getSession().then((session) => {
			if (!session) {
				router.replace(`${window.location.origin}/auth`)
			} else {
				setIsLoading(false)
			}
		})
	}, [router])
	return <>{isLoading ? <div>Loading</div> : <div>HomePage</div>}</>
}

export default Home
