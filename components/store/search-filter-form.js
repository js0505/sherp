import { useRef, useState } from "react"
import { getFilteredStore } from "../../lib/util/store-util"
import StoreSearchResult from "./search-result"

function StoreSearchFilterForm(props) {
	const { updateStoreCreditCount } = props
	const [searchedStore, setSearchedStore] = useState()

	const inputRef = useRef()

	async function submitHandler(e) {
		e.preventDefault()
		const filterData = inputRef.current.value
		if (filterData === "" || filterData === undefined) {
			setSearchedStore("")
			return
		}
		const response = await getFilteredStore(filterData)

		setSearchedStore(response)
	}

	return (
		<section className="container w-full flex flex-col">
			<div className="">
				<form className="flex justify-center" onSubmit={submitHandler}>
					<div className=" w-2/6">
						<input
							className="input-text  w-full mt-0"
							ref={inputRef}
							placeholder="검색어를 입력하세요.  ex) 가맹점명, 사업자번호, 지역, VAN"
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
				{searchedStore && (
					<StoreSearchResult
						searchedStore={searchedStore}
						updateStoreCreditCount={updateStoreCreditCount}
					/>
				)}
			</div>
		</section>
	)
}

export default StoreSearchFilterForm
