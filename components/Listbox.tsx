import { Listbox } from "@headlessui/react"
import { Control, FieldPath, FieldValues, useController } from "react-hook-form"

type ListboxValues = {
	value: string
	name?: string
}

type TControl<T extends FieldValues> = {
	control: Control<T>
	name: FieldPath<T>
}

interface ButtonProps {
	options: ListboxValues[]
	disabled?: boolean
	placeholder: string
}

type TProps<T extends FieldValues> = ButtonProps & TControl<T>

function ListboxButton<T extends FieldValues>({
	options,
	disabled,
	placeholder,
	name,
	control,
}: TProps<T>) {
	const { field } = useController({ control, name })

	return (
		<Listbox
			value={field.value}
			onChange={(data) => field.onChange(data.value)}
			disabled={disabled}
		>
			<div className="relative w-full ">
				<Listbox.Button
					className="
                    relative
                    w-full
                    rounded-lg 
                    border-2
                    bg-white 
                    py-4
                    pl-5 
                    pr-10 
                    text-left 
                    shadow-md
                    sm:text-sm
                    xl:text-lg
                    focus:outline-none 
                    focus-visible:border-sky-800 
                    focus-visible:ring-1
                    focus-visible:ring-white 
                    focus-visible:ring-opacity-75 
                    focus-visible:ring-offset-2 
                    focus-visible:ring-offset-sky-800 
            "
				>
					{field.value ? (
						<span className="block">{field.value}</span>
					) : (
						<span className="block text-neutral-400">{placeholder}</span>
					)}

					<span className="absolute top-4 right-0 pr-3">{">"}</span>
				</Listbox.Button>

				<Listbox.Options
					className="
                    absolute
                    z-50
                    w-full
                    mt-1
                    max-h-60
                    overflow-auto
                    rounded-md
                    bg-white
                    shadow-lg
                "
				>
					{options.map((option, index) => (
						<Listbox.Option
							key={name + index}
							value={option}
							className={({ active }) =>
								`
                                ${
																	active
																		? "bg-sky-600 text-white"
																		: "text-gray-900"
																}
                                py-4
                                pl-4

                                `
							}
						>
							{option.value}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</div>
		</Listbox>
	)
}

export default ListboxButton
