import { useState } from "react"
import { getFilteredStore } from "../../lib/util/store-util"
import Modal from "../ui/modal"
import StoreItemDetail from "./item-detail"
import StoreSearchResult from "./search-result"

function StoreSearchFilterForm(props) {
	const { filteredProducts } = props
	const [filterData, setFilterData] = useState()
	const [searchedStore, setSearchedStore] = useState()
	const [showModal, setShowModal] = useState(false)
	function modalHandler() {
		setShowModal(!showModal)
	}

	async function submitHandler(e) {
		e.preventDefault()

		if (filterData === "" || filterData === undefined) {
			setSearchedStore("")
			return
		}
		const response = await getFilteredStore(filterData)

		if (response.length === 1) {
			setSearchedStore(response)
			setShowModal(!showModal)
			return
		}
		setSearchedStore(response)
	}

	return (
		<>
			{showModal && (
				<Modal>
					<StoreItemDetail
						item={searchedStore[0]}
						modalHandler={modalHandler}
						filteredProducts={filteredProducts}
					/>
				</Modal>
			)}
			<section className="container w-4/5 flex flex-col">
				<div className="">
					<form className="flex justify-center" onSubmit={submitHandler}>
						<div className=" w-2/5">
							<input
								className="input-text  w-full mt-0"
								placeholder="사업자번호 또는 상호명을 입력하세요."
								onChange={(e) => setFilterData(e.target.value)}
							/>
						</div>
						<div className="flex ml-2 ">
							<button className="input-button mt-0" type="submit">
								검색
							</button>
						</div>
					</form>
				</div>
				<div className="flex justify-center">
					{searchedStore && searchedStore.length > 1 && (
						<StoreSearchResult searchedStore={searchedStore} />
					)}
				</div>
			</section>
		</>
	)
}

export default StoreSearchFilterForm
