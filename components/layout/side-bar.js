import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import RepairIcon from "../icons/repair-icon"
import ProductIcon from "../icons/product-icon"
import AdminIcon from "../icons/admin-icon"
import DownChevronIcon from "../icons/down-chevron"
import UpChevronIcon from "../icons/up-chevron"
import UserIcon from "../icons/user-icon"
import StoreIcon from "../icons/store-icon"
import waveposImg from "../../public/wavepos.png"

const sidebarData = [
	{
		title: "가맹점 관리",
		path: "",
		icon: <StoreIcon />,
		iconClosed: <DownChevronIcon />,
		iconOpened: <UpChevronIcon />,
		subNav: [
			{ title: "가맹점 등록", path: "/store/register", icon: "" },
			{ title: "가맹점 검색", path: "/store/search", icon: "" },
			{ title: "데이터 관리", path: "/store/data", icon: "" },
		],
	},
	{
		title: "수리",
		path: "",
		icon: <RepairIcon />,
		iconClosed: <DownChevronIcon />,
		iconOpened: <UpChevronIcon />,
		subNav: [
			{ title: "수리 접수", path: "/repair/register", icon: "" },
			{ title: "접수 리스트", path: "/repair/list?state=수리접수", icon: "" },
			{
				title: "입고 리스트",
				path: "/repair/list?state=수리완료",
				icon: "",
			},
			{
				title: "완료된 수리 내역",
				path: "/repair/log",
				icon: "",
			},
		],
	},
	{
		title: "장비",
		path: "",
		icon: <ProductIcon />,
		iconClosed: <DownChevronIcon />,
		iconOpened: <UpChevronIcon />,
		subNav: [
			{ title: "장비 등록", path: "/product/register", icon: "" },
			{ title: "장비 리스트", path: "/product/list", icon: "" },
			{ title: "입고, 출고 등록", path: "/product/qty", icon: "" },
			{ title: "입고, 출고 내역", path: "/product/log", icon: "" },
		],
	},
	{
		title: "관리자",
		path: "",
		icon: <AdminIcon />,
		iconClosed: <DownChevronIcon />,
		iconOpened: <UpChevronIcon />,
		subNav: [
			{ title: "법인 등록", path: "/brand/register", icon: "" },
			{ title: "제조사 등록", path: "/company/register", icon: "" },
		],
	},
]

function SubMenu(props) {
	const { data, toggle, isLogout = null } = props
	const [subnav, setSubnav] = useState(false)
	function showSubnav() {
		setSubnav(!subnav)
	}
	return (
		<>
			<div onClick={isLogout ? isLogout : data.subNav && showSubnav}>
				<div className="flex justify-between sidebar-item">
					<div className="flex">
						<div className="mr-2">{data.icon}</div>
						<div>
							{data.subNav ? (
								<div>{data.title}</div>
							) : (
								<Link href={data.path}>
									<div onClick={toggle}>{data.title}</div>
								</Link>
							)}
						</div>
					</div>
					<div className="pr-3">
						{data.subNav && subnav
							? data.iconOpened
							: data.subNav
							? data.iconClosed
							: null}
					</div>
				</div>
			</div>

			{subnav &&
				data.subNav.map((item, index) => (
					<Link href={item.path} className=" " key={index}>
						<div>
							<div
								onClick={toggle}
								className="py-3 px-7 bg-primaryHover hover:bg-primary cursor-pointer"
							>
								<div>{item.title}</div>
							</div>
						</div>
					</Link>
				))}
		</>
	)
}

const SideBar = (props) => {
	const { sideBarHandler } = props
	const { data: session } = useSession()

	const userData = {
		title: `${session ? session.user.name : ""}`,
		path: "",
		icon: <UserIcon />,
	}

	const logoutHandler = () => {
		return
		// const accept = confirm("로그아웃 하시겠습니까?")

		// if (!accept) {
		// 	return
		// } else {
		// 	signOut({
		// 		callbackUrl: `${window.location.origin}/auth`,
		// 	})
		// }
	}

	const closeSideBarHandler = () => {
		sideBarHandler()
	}

	return (
		<>
			{session && (
				<div
					className={` z-10  text-white bg-primary absolute w-full 
					lg:w-1/6 lg:h-full lg:relative ${props.showSideBar ? "" : "hidden lg:block"} `}
				>
					<div>
						<div className="lg:mt-1">
							<div className="hidden lg:block">
								<Image src={waveposImg} width={170} alt="wavepos" />
							</div>
							<SubMenu data={userData} isLogout={logoutHandler} />
						</div>
						{sidebarData &&
							sidebarData.map((item, index) => (
								<SubMenu data={item} key={index} toggle={closeSideBarHandler} />
							))}
					</div>
				</div>
			)}
		</>
	)
}

export default SideBar
