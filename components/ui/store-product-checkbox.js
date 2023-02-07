import { useController } from "react-hook-form"
import { storeProductsInit } from "../../lib/variables/variables"
export const StoreProductCheckbox = ({ control, name, disabled = false }) => {
	const optionIds = ["pos", "kiosk", "printer", "cat", "router"]

	const { field } = useController({
		control,
		name,
		defaultValue: storeProductsInit,
	})

	const buttonTitleSwitch = (id) => {
		let title
		switch (id) {
			case "pos":
				title = "포스"
				break
			case "kiosk":
				title = "키오스크"
				break
			case "printer":
				title = "주방프린터"
				break
			case "cat":
				title = "단말기"
				break
			case "router":
				title = "라우터"
				break
		}

		return title
	}
	return (
		<>
			{optionIds.map((id, index) => (
				<label
					className={`flex  rounded-md border border-gray-transparent w-40 h-14 mx-1 mt-2 
		 justify-center items-center shadow-md 
		 ${field.value[id] ? "bg-primary" : ""}`}
					key={index}
				>
					<input
						className={`appearance-none`}
						onChange={(e) => {
							let newProduct = { ...field.value }
							newProduct[e.target.id] = e.target.checked
							field.onChange(newProduct)
						}}
						key={id}
						id={id}
						type="checkbox"
						value={field.value}
						disabled={disabled}
					/>
					<p
						className={`${
							field.value[id] ? "text-white" : ""
						} text-sm lg:text-lg`}
					>
						{buttonTitleSwitch(id)}
					</p>
				</label>
			))}
		</>
	)
}
