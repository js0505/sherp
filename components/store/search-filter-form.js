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
import { format } from "date-fns"

function StoreSearchFilterForm() {
	const [trigger, result] = useLazyGetFilteredStoresQuery()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const dropdownUsers = editItemforDropdownButton(allUsersData?.users)

	const today = new Date()
	const todayYear = format(today, "yyyy")

	const businessNumInputRef = useRef("")
	const storeNameInputRef = useRef("")
	const [van, setVan] = useState("")
	const [city, setCity] = useState("")
	const [user, setUser] = useState("")
	const [year, setYear] = useState(todayYear)

	const submitHandler = async (e) => {
		e.preventDefault()

		const businessNum = businessNumInputRef.current.value
		const storeName = storeNameInputRef.current.value

		if (Number.isNaN(Number(businessNum))) {
			alert("사업자번호는 숫자만 입력 가능합니다.")
			return
		}
		if (businessNum && storeName) {
			alert("사업자번호와 상호명 중 한가지만 검색 가능합니다.")
			return
		}

		const query = {
			businessNum,
			storeName,
			van: van.value ? van.value : "",
			city: city.value ? city.value : "",
			user: user.label ? user.label : "",
		}

		await trigger(query)
	}

	return (
		<section className="lg:container lg:w-5/6 w-full flex flex-col">
			<div className="">
				<form className="flex justify-center" onSubmit={submitHandler}>
					<div className=" lg:w-2/3 grid  grid-cols-6 gap-3">
						<input
							className="input-text  col-span-3 w-full mt-0 text-lg"
							type="text"
							ref={businessNumInputRef}
							placeholder="사업자번호"
							maxLength={10}
							onChange={(e) => e.target.value.replace(/[^0-9]/g, "")}
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
							<div className="flex lg:justify-end">
								{/* <button
									className="input-button mr-3 lg:w-[8rem] "
									type="button"
									onClick={() => setYear("2022")}
								>
									2022
								</button>
								<button
									className="input-button mr-3 lg:w-[8rem] "
									type="button"
									onClick={() => setYear("2023")}
								>
									2023
								</button> */}
								<button
									className="input-button mr-3 lg:w-[8rem] "
									type="submit"
								>
									검색
								</button>
								<button
									className="input-button lg:w-[8rem] "
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

			{result.data && (
				<StoreSearchResult
					year={year}
					searchedStore={result.data.filteredStore}
				/>
			)}
		</section>
	)
}

export default StoreSearchFilterForm
