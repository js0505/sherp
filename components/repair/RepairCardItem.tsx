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
				className="
					cursor-pointer 
					h-16 
					pt-3 
					lg:py-2 
					px-2 
					mb-3 
					border 
					border-gray-transparent 
					rounded-md 
					shadow-md 
					hover:bg-gray-300 
					hover:bg-opacity-10
				"
				onClick={modalHandler}
			>
				<div
					className="
						w-full 
						text-lg 
						lg:text-base 
						flex 
						font-medium
				"
				>
					<div className="mr-2">{item.storeName} </div>
					<span className="mr-2">{item.product.name} </span>
					<span className="mr-1">{item.qty}대</span>
					{item.reply.length > 0 && <span> ({item.reply.length})</span>}
				</div>
				<div
					className="
						text-gray-600 
						text-xs 
						lg:text-base  
						flex 
						lg:justify-end 
						w-full 
						p-0 
				"
				>
					<div className="mr-2">{item.user}</div>
					<div>{item.date}</div>
				</div>
			</div>
		</>
	)
}
