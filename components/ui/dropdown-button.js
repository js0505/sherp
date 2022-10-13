import { useCallback, useEffect, useState } from "react"
import { LeftArrow } from "./icons/arrows"

function DropDownButton(props) {
	// items : 전체 옵션이 들어있는 배열. {name, _id}
	// value : 현재 선택된 값의 이름.
	// handler : 선택된 데이터의 id 값을 상위 컴포넌트로 보내주는 함수.
	// value가 변한다 -> items에서 찾아서 해당하는 item 하나를 상태에 집어넣는다 -> 그 상태를 보여준다.
	const { items, label, handler, value, disabled = false } = props

	const [selectedItem, setSelectedItem] = useState()
	const [visibleAnimation, setVisibleAnimation] = useState(false)
	const [toggle, setToggle] = useState(false)

	const optionSelectHandler = useCallback(
		(item) => {
			if (item) {
				handler(item._id)
				setSelectedItem(item)
			}
		},
		[handler],
	)

	useEffect(() => {
		if (items && selectedItem === undefined) {
			setSelectedItem(() => items[0])
		}

		if (value) {
			const correctValue = items.find((item) => item.name === value)
			optionSelectHandler(correctValue)
		}

		if (toggle) {
			setVisibleAnimation(true)
		} else {
			setTimeout(() => {
				setVisibleAnimation(false)
			}, 400)
		}
	}, [toggle, handler, items, selectedItem, value, optionSelectHandler])

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
								<span>{selectedItem && selectedItem.name}</span>
								<span className={`duration-300  ${toggle ? "-rotate-90" : ""}`}>
									<LeftArrow />
								</span>
							</div>
						</button>
						{visibleAnimation && (
							<div className="relative">
								<div className={`absolute w-full overflow-auto h-80`}>
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
