import { useEffect, useState } from "react"
import { LeftArrow } from "./icons/arrows"

function DropDownButton(props) {
	const { items, label, handler, initValue = null, disabled = false } = props

	const [initItemName, setInitItemName] = useState()
	const [selectedItem, setSelectedItem] = useState()
	const [visibleAnimation, setVisibleAnimation] = useState(false)
	const [toggle, setToggle] = useState(false)

	useEffect(() => {
		if (items) {
			if (initValue) {
				const value = items.find((item) => item.name === initValue)

				setInitItemName(value)
			} else {
				setInitItemName(items[0])
			}
		}

		if (toggle) {
			setVisibleAnimation(true)
		} else {
			setTimeout(() => {
				setVisibleAnimation(false)
			}, 400)
		}
	}, [toggle, handler, items, initValue])

	function optionSelectHandler(item) {
		handler(item._id)
		setSelectedItem(item)
	}

	function dropdownToggleHandler(e) {
		e.preventDefault()
		setToggle(!toggle)
	}
	function disabledHandler(e) {
		e.preventDefault()
		setToggle(false)
		setVisibleAnimation(false)
	}

	return (
		<>
			{items && (
				<>
					<label className="input-label">{label}</label>
					<div className="w-full">
						<button
							onBlur={() => setToggle(false)}
							className=" px-4 h-12 mt-1 block w-full text-left  rounded-md 
										border border-gray-300 shadow-md text-lg lg:text-md 
										focus:border-primary focus:ring-2  focus:ring-primary focus:outline-none"
							onClick={!disabled ? dropdownToggleHandler : disabledHandler}
						>
							<div className="flex justify-between ">
								<span>
									{(selectedItem && selectedItem.name) ||
										(initItemName && initItemName.name)}
								</span>
								<span className={`duration-300  ${toggle ? "-rotate-90" : ""}`}>
									<LeftArrow />
								</span>
							</div>
						</button>
						{visibleAnimation && (
							<div className="relative">
								<div className={`absolute w-full overflow-hidden`}>
									<ul
										className={`border border-gray-transparent  bg-white w-full shadow-md rounded-md mt-1 ${
											toggle
												? "animate-dropdownFadeIn"
												: "animate-dropdownFadeOut"
										}`}
									>
										{items.map((item) => (
											<li
												key={item._id}
												onClick={() => optionSelectHandler(item)}
												className="hover:bg-primary  hover:text-white border-b border-b-gray-transparent 
															 h-12 text-lg lg:text-md px-3 pt-3"
											>
												{item.name}
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</>
	)
}

export default DropDownButton
