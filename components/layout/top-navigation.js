import Link from "next/link"
import { NavBarIcon } from "../ui/icons/icons"
import Image from "next/image"
import waveposImg from "../../public/wavepos.png"

const TopNavigation = (props) => {
	return (
		<header className="lg:hidden flex justify-between h-14 z-30  w-full text-white bg-primary px-2 pt-1 ">
			<Link href="/">
				<a className="mt-2">
					<Image src={waveposImg} width={170} alt="wavepos" />
				</a>
			</Link>
			<div className="lg:hidden " onClick={props.sideBarHandler}>
				<NavBarIcon />
			</div>
		</header>
	)
}

export default TopNavigation
