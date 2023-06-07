import React from "react"
import {
	FieldErrors,
	FieldValues,
	RegisterOptions,
	UseFormRegister,
} from "react-hook-form"
interface InputProps {
	id: string
	label: string
	type?: string
	disabled?: boolean
	required?: boolean
	register: UseFormRegister<FieldValues>
	errors: FieldErrors
	options?: RegisterOptions
	maxLength?: number
}

const Input: React.FC<InputProps> = ({
	id,
	label,
	type = "text",
	disabled,
	required,
	register,
	errors,
	options,
	maxLength,
}) => {
	return (
		<div className="w-full relative">
			<input
				id={id}
				disabled={disabled}
				placeholder=""
				type={type}
				maxLength={maxLength}
				{...register(id, { required, ...options })}
				className={`
                    peer
                    w-full
                    p-4
                    pt-6
					font-medium
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    ${errors[id] ? "border-rose-500" : "border-neutral-300"}
                    ${
											errors[id]
												? "focus:border-rose-500"
												: "focus:border-sky-600"
										}
                `}
			/>
			<label
				className={`
                    absolute 
                    text-sm
                    duration-150 
                    transform 
                    -translate-y-3 
                    top-5
                    left-4
                    z-10 
                    origin-[0]
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75
                    peer-focus:-translate-y-4
                    ${errors[id] ? "text-rose-500" : "text-zinc-400"}
                `}
			>
				{label}
			</label>
		</div>
	)
}

export default Input
