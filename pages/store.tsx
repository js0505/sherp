import { useLazyGetFilteredStoresQuery } from "../query/storeApi"

import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { cityItems, vanItems } from "../lib/variables/variables"

import Container from "@/components/Container"
import Heading from "@/components/Heading"
import Input from "@/components/inputs/Input"
import ListboxButton from "@/components/Listbox"
import Button from "@/components/Button"
import StoreTable from "@/components/store/StoreTable"
import getUsersList from "@/actions/getUsersList"
import useRegisterStoreModal from "@/hooks/useRegisterStoreModal"
import RegisterStoreModal from "@/components/modals/RegisterStoreModal"
import useUpdateStoreModal from "@/hooks/useUpdateStoreModal"
import UpdateStoreModal from "@/components/modals/UpdateStoreModal"
import { useState } from "react"
import Loader from "@/components/Loader"

export async function getServerSideProps() {
	const users = await getUsersList()
	return {
		props: { users },
	}
}

const StorePage = ({ users }) => {
	const registerStoreModal = useRegisterStoreModal()
	const updateStoreModal = useUpdateStoreModal()
	const [isFilteredStoresLoading, setIsFilteredStoresLoading] = useState(false)

	const [trigger, result] = useLazyGetFilteredStoresQuery()

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		control,
		watch,
		setValue,
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			user: "",
			van: "",
			city: "",
			storeName: "",
			businessNum: "",
		},
	})

	const isCorporationFilterValue = watch("isCorporation")

	const fetchedStoreResultData =
		isCorporationFilterValue === false
			? result.data?.filteredStore
			: result.data?.filteredStore.filter(
					(store) => store.isCorporation === true,
			  )

	const onSubmit: SubmitHandler<FieldValues | any> = async (formData) => {
		setIsFilteredStoresLoading(true)
		const { user, van, city, storeName, businessNum } = formData

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
			user,
			van,
			city,
			storeName,
			businessNum,
		}

		await trigger(query)
		setIsFilteredStoresLoading(false)
	}
	return (
		<>
			{registerStoreModal.isOpen && <RegisterStoreModal users={users} />}
			{updateStoreModal.isOpen && <UpdateStoreModal users={users} />}

			{isFilteredStoresLoading && <Loader />}
			<Container>
				<Heading title="가맹점 관리" />
				<div className="flex flex-col md:flex-row gap-4 pt-4">
					<div className="md:basis-1/5 w-full">
						<div
							className="
								flex
								flex-col
								gap-5
							"
						>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="grid grid-cols-12 gap-2"
							>
								<div className="col-span-6 md:col-span-12">
									<Input
										id="storeName"
										label="가맹점명"
										errors={errors}
										register={register}
									/>
								</div>
								<div className="col-span-6 md:col-span-12">
									<Input
										id="businessNum"
										label="사업자번호"
										errors={errors}
										register={register}
									/>
								</div>
								<div className="col-span-4 md:col-span-12">
									<ListboxButton
										control={control}
										name="van"
										options={vanItems}
										placeholder="VAN"
									/>
								</div>
								<div className="col-span-4 md:col-span-6">
									<ListboxButton
										control={control}
										name="city"
										options={cityItems}
										placeholder="도시"
									/>
								</div>
								<div className="col-span-4 md:col-span-6">
									<ListboxButton
										control={control}
										name="user"
										options={users}
										placeholder="담당자"
									/>
								</div>
								<div className="col-span-6 md:col-span-6">
									<Button label="검색" type="submit" onClick={() => ""} />
								</div>
								<div className="col-span-6 md:col-span-6">
									<Button
										label="초기화"
										onClick={() => {
											reset()
										}}
									/>
								</div>
								<div className="hidden md:block md:md:col-span-12">
									<Button
										outline
										label="신규 가맹점 등록"
										onClick={() => registerStoreModal.onOpen()}
									/>
								</div>
							</form>
						</div>
					</div>
					<div className="flex md:basis-4/5">
						{fetchedStoreResultData && (
							<StoreTable data={fetchedStoreResultData} />
						)}
					</div>
				</div>
			</Container>
		</>
	)
}

export default StorePage
