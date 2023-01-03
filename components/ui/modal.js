function Modal({ children }) {
	return (
		<div className="relative z-40">
			<div className={`fixed inset-0 bg-gray-300 bg-opacity-90 `}>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center  justify-center p-4  ">
						<div className="relative w-full lg:w-auto rounded-lg bg-white shadow-2xl ">
							<div>{children}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal
