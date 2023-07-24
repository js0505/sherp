import { useState } from "react"

interface Props {
	item: any
}

export default function RepairCardItem({ item }: Props) {
	const [showModal, setShowModal] = useState(false)
	function modalHandler() {
		setShowModal(!showModal)
	}

	return (
		<>
			<div
				className="h-16 px-2 pt-3 mb-3 border rounded-md shadow-md cursor-pointer lg:py-2 border-gray-transparent hover:bg-gray-300 hover:bg-opacity-10"
				onClick={modalHandler}
			>
				<div className="flex w-full text-lg font-medium lg:text-base">
					<div className="mr-2">{item.storeName} </div>
					<span className="mr-2">{item.product.name} </span>
					<span className="mr-1">{item.qty}대</span>
					{item.reply.length > 0 && <span> ({item.reply.length})</span>}
				</div>
				<div className="flex w-full p-0 text-xs text-gray-600 lg:text-base lg:justify-end">
					<div className="mr-2">{item.user}</div>
					<div>{item.date}</div>
				</div>
			</div>
		</>
	)
}
