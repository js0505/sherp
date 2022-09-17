import { useState } from "react"
import Modal from "../ui/modal"
import RepairItemDetail from "./repair-item-detail"

function RepairCardItem(props) {
	const { item, replaceListHandler, state } = props

	const [showModal, setShowModal] = useState(false)
	function modalHandler() {
		setShowModal(!showModal)
	}
	

	function checkDateFunction() {
		const today = new Date().now()
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
				className=" mt-5 h-20 p-2 cursor-pointer rounded-md shadow-lg hover:bg-gray-300 hover:bg-opacity-10"
				onClick={modalHandler}
			>
				<div className=" w-full text-md flex mb-1 mt-1">
					<span className="mr-2">{item.storeName} </span>
					<span className="mr-2">{item.product.name} </span>
					<span>{item.qty}대</span>
				</div>
				<div className="text-gray-300 text-md ">
					<span className="mr-2">{item.user.name}</span>
					<span className="mr-2">/</span>
					<span>{item.date}</span>
					<span></span>
				</div>
			</div>
		</>
	)
}

export default RepairCardItem
