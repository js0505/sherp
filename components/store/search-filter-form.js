import { useRef } from "react"
import StoreSearchResult from "./search-result"
import { useLazyGetFilteredStoresQuery } from "../../query/api"

function StoreSearchFilterForm() {
	const inputRef = useRef()
	const [trigger, result] = useLazyGetFilteredStoresQuery()

	const submitHandler = async (e) => {
		e.preventDefault()
		const filterData = inputRef.current.value
		if (filterData === "" || filterData === undefined) {
			return
		}

		await trigger({ filter: filterData })
	}

	return (
		<section className="container w-full flex flex-col">
			<div className="">
				<form className="flex justify-center" onSubmit={submitHandler}>
					<div className=" w-2/6">
						<input
							className="input-text  w-full mt-0 text-lg"
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
				{result.data && (
					<StoreSearchResult searchedStore={result.data.filteredStore} />
				)}
			</div>
		</section>
	)
}

export default StoreSearchFilterForm
