function StoreSearchResult(props) {
	const { searchedStore } = props

	return (
		<>
			<div className="w-full mt-10">
				<div className=" text-center text-xl mb-10">검색결과</div>
				<div className="flex justify-center ">
					<div className=" w-2/5 ">
						{searchedStore.map((item, index) => (
							<div key={index}>
								<div
									className=" cursor-pointer h-15 py-3 px-2 mb-2 border border-gray-transparent 
				                    rounded-md shadow-md hover:bg-gray-300 hover:bg-opacity-10  "
								>
									<div className="flex justify-between">
										<div className="text-lg">{item.storeName}</div>
										<div className="text-md text-gray-300 mt-1">
											{item.businessNum}
										</div>
										<div className="pr-3">{item.van}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default StoreSearchResult
