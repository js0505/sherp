import { Dialog } from "@headlessui/react"
import { Transition } from "@tailwindui/react"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import Heading from "../Heading"

interface ModalProps {
	isOpen?: boolean
	onClose: () => void
	onSubmit?: () => void
	body?: React.ReactElement
	disabled?: boolean
	title: string
	isLoading?: boolean
}

function Modal(props: ModalProps) {
	const { onClose, onSubmit, isOpen, body, disabled, title, isLoading } = props
	const [showModal, setShowModal] = useState(isOpen)

	useEffect(() => {
		setShowModal(isOpen)
	}, [isOpen])

	const handleClose = useCallback(() => {
		if (disabled) {
			return
		}

		setShowModal(false)
		setTimeout(() => {
			onClose()
		}, 220)
	}, [onClose, disabled])

	const handleSubmit = useCallback(() => {
		if (disabled) {
			return
		}

		onSubmit()
	}, [onSubmit, disabled])

	// const handleSecondaryAction = useCallback(() => {
	// 	if (disabled || !secondaryAction) {
	// 		return
	// 	}

	// 	secondaryAction()
	// }, [secondaryAction, disabled])

	if (!isOpen || isLoading) {
		return null
	}

	return (
		<Dialog
			as="div"
			onClose={handleClose}
			open={isOpen}
			className={`relative z-40 overflow-auto `}
		>
			<div
				className={`
							fixed
							inset-0
							flex
							items-center
							justify-center
							p-4
							bg-gray-300
							bg-opacity-50
				`}
			/>

			<div
				className={`
							fixed 
							inset-0 
							overflow-y-auto
							translate
            				duration-500
							${showModal ? "translate-y-0" : "translate-y-full"}
            				${showModal ? "opacity-100" : "opacity-0"}
			`}
			>
				<div className="flex flex-col min-h-full justify-center items-center">
					<Dialog.Panel
						className={`
								w-full
								md:w-4/6
								lg:w-3/6
								xl:w-2/5
								z-50
								overflow-hidden
								rounded-lg
								bg-white
								shadow-2xl
								lg:h-auto
								md:h-auto
								p-4
								my-8
								md:my-0
								
						`}
					>
						<div className="flex justify-between">
							<div className="pl-4">
								<Heading title={title} />
							</div>

							<span
								onClick={handleClose}
								className="
								pr-4
								pt-1
								text-xl
								cursor-pointer
								"
							>
								X
							</span>
						</div>

						<div
							className="
								md:p-4
							"
						>
							{body}
						</div>
					</Dialog.Panel>
				</div>
			</div>
		</Dialog>
	)
}

export default Modal
