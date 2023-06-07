import { useRouter } from "next/navigation"
import React from "react"
import MenuItem from "./MenuItem"

function Menu() {
	const router = useRouter()

	return (
		<div
			className="
				flex
				justify-center
				md:justify-start
				gap-4
				w-full

			"
		>
			<MenuItem label="가맹점" onClick={() => router.push("/store")} />
			<MenuItem label="수리" onClick={() => router.push("/repair")} />
			<div className="hidden md:block">
				<MenuItem label="관리자" onClick={() => router.push("/admin")} />
			</div>
		</div>
	)
}

export default Menu
