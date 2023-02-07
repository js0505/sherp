import { Dialog, Transition } from "@headlessui/react"

import { Fragment } from "react"

function Modal({ children, isOpen, onClose }) {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" onClose={onClose} className="relative z-40">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 flex items-center justify-center p-4  bg-gray-300 bg-opacity-50" />
				</Transition.Child>

				<div className="fixed inset-0 ">
					<div className="flex min-h-full justify-center items-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-90"
							enterTo="opacity-100 scale-100"
							leave=" ease-in duration-600"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-0"
						>
							<Dialog.Panel className=" w-full z-50 lg:w-auto overflow-hidden rounded-lg bg-white shadow-2xl">
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default Modal
