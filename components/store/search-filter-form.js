import { useRef, useState } from "react"
import StoreSearchResult from "./search-result"
import {
	useGetAllItemsByUrlQuery,
	useLazyGetFilteredStoresQuery,
} from "../../query/api"
import Dropdown from "react-dropdown"
import { DownArrow } from "../ui/icons/arrows"
import { cityItems, vanItems } from "../../lib/variables/variables"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"

function StoreSearchFilterForm() {
	const [trigger, result] = useLazyGetFilteredStoresQuery()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const dropdownUsers = editItemforDropdownButton(allUsersData?.users)

	const businessNumInputRef = useRef()
	const storeNameInputRef = useRef()
	const [van, setVan] = useState("")
	const [city, setCity] = useState("")
	const [user, setUser] = useState("")

	const submitHandler = async (e) => {
		e.preventDefault()

		const businessNum = businessNumInputRef.current.value
		const storeName = storeNameInputRef.current.value

		if (businessNum && storeName) {
			alert("사업자번호와 상호명 중 한가지만 검색 가능합니다.")
			return
		}

		await trigger({
			businessNum,
			storeName,
			van: van.value ? van.value : "",
			city: city.value ? city.value : "",
			user: user.label ? user.label : "",
		})
	}

	return (
		<section className="container w-full flex flex-col">
			<div className="">
				<form className="flex justify-center" onSubmit={submitHandler}>
					<div className=" w-1/2 grid  grid-cols-6 gap-3">
						<input
							className="input-text  col-span-3 w-full mt-0 text-lg"
							ref={businessNumInputRef}
							placeholder="사업자번호"
						/>
						<input
							className="input-text  col-span-3 w-full mt-0 text-lg"
							ref={storeNameInputRef}
							placeholder="가맹점명"
						/>

						<Dropdown
							className=" col-span-2"
							placeholder="VAN"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={vanItems.slice(1, vanItems.length)}
							onChange={setVan}
							value={van}
						/>
						<Dropdown
							className=" col-span-2"
							placeholder="도시"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={cityItems}
							onChange={setCity}
							value={city}
						/>
						<Dropdown
							className=" col-span-2"
							placeholder="담당자"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={dropdownUsers}
							onChange={setUser}
							value={user}
						/>
						<div className="col-span-6">
							<div className="flex justify-end">
								<button className="input-button mr-3 w-[8rem] " type="submit">
									검색
								</button>
								<button
									className="input-button w-[8rem] "
									type="button"
									onClick={() => {
										businessNumInputRef.current.value = ""
										storeNameInputRef.current.value = ""
										setVan("")
										setCity("")
										setUser("")
									}}
								>
									초기화
								</button>
							</div>
						</div>
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
