
import PageTitle from "../../components/ui/page-title"
import StoreSearchResultTable from "../../components/store/StoreSearchResultTable"
import Loader from "../../components/ui/loader"
import { useLazyGetFilteredStoresQuery } from "../../query/storeApi"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import { editUserforDropdown } from "../../lib/util/dropdown-util"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dropdown } from "../../components/ui/dropdown"
import { cityItems, vanItems } from "../../lib/variables/variables"



const StoreSearchPage = () => {
	const [trigger, result] = useLazyGetFilteredStoresQuery()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const dropdownUsers = editUserforDropdown(allUsersData?.users)

	const today = new Date()
	const todayYear = format(today, "yyyy")

	const [year, setYear] = useState(todayYear)

	const { control, register, handleSubmit, reset, setValue, getValues, watch } =
		useForm({
			mode: "onSubmit",
			defaultValues: {
				van: "",
				city: "",
				user: "",
				businessNum: "",
				storeName: "",
				isCorporation: false,
			},
		})
	const isCorporationFilterValue = watch("isCorporation")

	const filteredisCorporationStoreList =
		isCorporationFilterValue === false
			? result.data?.filteredStore
			: result.data?.filteredStore.filter(
					(store) => store.isCorporation === true,
			  )

	const submitHandler = async (formData) => {
		setValue("isCorporation", false)

		if (Number.isNaN(Number(formData.businessNum))) {
			alert("사업자번호는 숫자만 입력 가능합니다.")
			return
		}
		if (formData.businessNum && formData.storeName) {
			alert("사업자번호와 상호명 중 한가지만 검색 가능합니다.")
			return
		}

		const query = {
			...formData,
		}

		await trigger(query)
	}
	return (
		<>
			{result.isLoading && <Loader />}
			<PageTitle title="가맹점 검색" />
			<section className="lg:container lg:w-5/6 w-full flex flex-col">
				<div className="">
					<form
						className="flex justify-center"
						onSubmit={handleSubmit(submitHandler)}
					>
						<div className=" lg:w-2/3 grid  grid-cols-6 gap-3 ">
							<input
								className="input-text  col-span-3 w-full mt-0 text-lg"
								type="text"
								placeholder="사업자번호"
								maxLength={10}
								{...register("businessNum")}
							/>
							<input
								className="input-text  col-span-3 w-full mt-0 text-lg"
								placeholder="가맹점명"
								{...register("storeName")}
							/>
							<div className="col-span-2">
								<Dropdown
									control={control}
									options={vanItems.slice(1, vanItems.length)}
									name="van"
									placeholder="VAN"
								/>
							</div>
							<div className="col-span-2">
								<Dropdown
									control={control}
									options={cityItems}
									name="city"
									placeholder="도시"
								/>
							</div>
							<div className="col-span-2">
								<Dropdown
									className="text-xs"
									control={control}
									options={dropdownUsers}
									name="user"
									placeholder="담당자"
								/>
							</div>

							<div className="col-span-6 flex lg:justify-between  ">
								<div className={`lg:w-1/2 lg:block hidden`}>
									<label
										className={`flex  rounded-md  border-gray-transparent w-full lg:w-1/2 h-14 px-2 mt-2
									 justify-center items-center shadow-md
									 ${filteredisCorporationStoreList ? "" : "hidden"}
									`}
									>
										<input
											type="checkbox"
											className=" appearance-none "
											{...register("isCorporation")}
											onChange={() => {
												const prevValue = getValues("isCorporation")
												setValue("isCorporation", !prevValue)
											}}
										/>
										<div
											className={`w-4 h-4 mr-3  border-gray-300 border-opacity-50 
											flex justify-center items-center text-xs text-white 
											${isCorporationFilterValue ? "bg-green border-none" : ""}`}
										>
											v
										</div>
										<p className={``}>결과 내 법인사업자 보기</p>
									</label>
								</div>
								<div className="flex w-full lg:w-1/2 lg:justify-end">
									<button
										className="input-button mr-3 w-full lg:w-[8rem] "
										type="submit"
									>
										검색
									</button>
									<button
										className="input-button w-full lg:w-[8rem] "
										type="button"
										onClick={() => reset()}
									>
										초기화
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>

				{result.isLoading && <Loader />}

				{filteredisCorporationStoreList && (
					<StoreSearchResultTable
						isDataLoading={result.isLoading}
						year={year}
						rowData={filteredisCorporationStoreList}
					/>
				)}
			</section>
		</>
	)
}

export default StoreSearchPage
