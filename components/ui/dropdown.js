import ReactDropdown from "react-dropdown"
import { DownArrow } from "./icons/icons"
import { useController } from "react-hook-form"

export const Dropdown = ({
	control,
	options,
	name,
	onChange = null,
	placeholder = null,
	required = false,
}) => {
	const { field } = useController({ control, name, rules: { required } })

	return (
		<ReactDropdown
			arrowClosed={<DownArrow />}
			arrowOpen={<DownArrow />}
			options={options}
			onChange={onChange ? onChange : (data) => field.onChange(data.value)}
			value={field.value}
			placeholder={placeholder}
			
		/>
	)
}
