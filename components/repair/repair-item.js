import { useState } from "react"
import Modal from "../ui/modal"
import RepairItemDetail from "./repair-item-detail"

function RepairCardItem(props) {
	const { item, replaceListHandler, state } = props

	const [showModal, setShowModal] = useState(false)
	function modalHandler() {
		setShowModal(!showModal)
	}

	return (
		<>
			{showModal && (
				<Modal>
					<RepairItemDetail
						state={state}
						modalHandler={modalHandler}
						replaceListHandler={replaceListHandler}
						item={item}
					/>
				</Modal>
			)}
			<div
				className=" cursor-pointer h-16 pt-3 lg:py-2 px-2 mb-3 border border-gray-transparent 
				rounded-md shadow-lg hover:bg-gray-300 hover:bg-opacity-10"
				onClick={modalHandler}
			>
				<div className=" w-full text-lg lg:text-base flex font-medium">
					<div className="mr-2">{item.storeName} </div>
					<span className="mr-2">{item.product.name} </span>
					<span>{item.qty}대</span>
				</div>
				<div className="text-gray-300 text-xs lg:text-base  flex lg:justify-end w-full p-0 ">
					<div className="mr-2">{item.user.name}</div>
					<div>{item.date}</div>
				</div>
			</div>
		</>
	)
}

export default RepairCardItem
