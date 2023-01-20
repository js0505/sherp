import Link from "next/link"
import NavBarIcon from "../icons/nav-bar-icon"
import Image from "next/image"
import waveposImg from "../../public/wavepos.png"

const TopNavigation = (props) => {
	return (
		<header className="lg:hidden flex justify-between h-10 z-30  w-full text-white bg-primary px-2 pt-1 ">
			<Link href="/">
				<a>
					<Image src={waveposImg} width={170} alt="wavepos" />
				</a>
			</Link>
			<div className="lg:hidden" onClick={props.sideBarHandler}>
				<NavBarIcon />
			</div>
		</header>
	)
}

export default TopNavigation
