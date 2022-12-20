import { useState, useEffect, useRef } from "react"
export const CheckboxButton = ({
	id,
	value,
	onChangeFunction,
	title,
	disabled,
}) => {
	const [isChecked, setIsChecked] = useState(false)
	const inputRef = useRef()
	useEffect(() => {
		if (value) {
			setIsChecked(value[id])
			inputRef.current.checked = value[id]
		}
	}, [id, value])

	return (
		<>
			<label
				className={`flex  rounded-md border border-gray-transparent w-40 h-14 mx-1 mt-2 
				justify-center items-center shadow-md 
				${isChecked ? "bg-primary" : ""}`}
			>
				<input
					disabled={disabled}
					ref={inputRef}
					className={`appearance-none`}
					type="checkbox"
					id={id}
					onChange={(e) => {
						setIsChecked(e.target.checked)
						onChangeFunction((oldProduct) => {
							let newProduct = { ...oldProduct }
							newProduct[e.target.id] = e.target.checked
							return newProduct
						})
					}}
				/>
				<p className={`${isChecked ? "text-white" : ""} text-lg`}>{title}</p>
			</label>
		</>
	)
}
