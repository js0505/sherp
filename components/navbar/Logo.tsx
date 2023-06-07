import { useRouter } from "next/navigation"

const Logo = () => {
	const router = useRouter()
	return (
		<h1
			className="
			 py-2
			 text-lg
			 hidden
			 cursor-pointer
			 md:block		
		"
			onClick={() => router.push("/")}
		>
			WavePOS
		</h1>
	)
}

export default Logo
