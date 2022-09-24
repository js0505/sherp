import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import RepairIcon from "../icons/repair-icon"
import ProductIcon from "../icons/product-icon"
import AdminIcon from "../icons/admin-icon"
import DownChevronIcon from "../icons/down-chevron"
import UpChevronIcon from "../icons/up-chevron"
import UserIcon from "../icons/user-icon"

const sidebarData = [
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
				title: "수리 입고 리스트",
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
			{ title: "장비 입/출고", path: "/product/qty", icon: "" },
			{ title: "장비 리스트", path: "/product/list", icon: "" },
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

function SideBar(props) {
	const { sideBarHandler } = props
	const { data: session } = useSession()

	const userData = {
		title: `${session ? session.user.name : ""}`,
		path: "",
		icon: <UserIcon />,
	}

	function logoutHandler() {
		const accept = confirm("로그아웃 하시겠습니까?")

		if (!accept) {
			return
		} else {
			signOut({
				callbackUrl: `${window.location.origin}/auth`,
			})
		}
	}

	function closeSideBarHandler() {
		sideBarHandler()
	}
	return (
		<>
			{session && (
				<div
					className={` z-10 absolute lg:relative pt-10 h-full lg:h-full lg:basis-1/6 text-white 
					bg-primary transition-width duration-200 ease-in-out ${
						props.showSideBar ? "w-2/4 lg:w-1/6" : "w-0 lg:w-full"
					}`}
				>
					<div className={`${!props.showSideBar ? "hidden md:block" : ""}`}>
						<div>
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
