import useUpdateStoreModal from "@/hooks/useUpdateStoreModal"
import {
	cityItems,
	inOperationItems,
	vanItems,
} from "@/lib/variables/variables"
import {
	useDeleteStoreMutation,
	useGetStoreByIdQuery,
	useUpdateStoreMutation,
} from "@/query/storeApi"
import { format } from "date-fns"
import React, { useEffect } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Button from "../Button"
import Input from "../inputs/Input"
import ListboxButton from "../Listbox"
import Loader from "../Loader"
import { StoreProductCheckbox } from "../ui/StoreProductCheckbox"
import Modal from "./Modal"

interface Props {
	users: [
		{
			value: string
			label: string
		},
	]
}

function UpdateStoreModal(props: Props) {
	const { users } = props
	const updateStoreModal = useUpdateStoreModal()

	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const { data, isLoading } = useGetStoreByIdQuery({
		storeId: updateStoreModal.storeId,
	})

	const item = data?.store

	const [updateStore] = useUpdateStoreMutation()
	const [deleteStore] = useDeleteStoreMutation()

	const {
		register,
		reset,
		control,
		setValue,
		watch,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			contractDate: "",
			closeDate: "",
			note: "",
			storeName: "",
			businessNum: "",
			address: "",
			owner: "",
			contact: "",
			vanId: "",
			vanCode: "",
			cms: "",
			product: {
				pos: false,
				kiosk: false,
				printer: false,
				cat: false,
				router: false,
			},
			user: "",
			van: "",
			city: "",
			inOperation: "",
		},
	})

	useEffect(() => {
		if (item) {
			reset({
				contractDate: item.contractDate,
				note: item.note,
				storeName: item.storeName,
				businessNum: item.businessNum,
				address: item.address,
				owner: item.owner,
				contact: item.contact,
				vanId: item.vanId,
				vanCode: item.vanCode,
				van: item.van,
				cms: item.cms,
				city: item.city,
				user: item.user,
				product: item.product,
				inOperation: item.inOperation,
				closeDate: item.closeDate,
			})
		}
	}, [item])

	const editStoreSubmitHandler = async (formData) => {
		if (String(formData.businessNum).length != 10) {
			alert("사업자번호는 10자리 입니다.")
			return
		}

		const accept = confirm("변경된 정보를 저장 하시겠습니까?")
		if (!accept) {
			return
		}

		const body = {
			_id: item._id,
			...formData,
		}

		const response = await updateStore(body).unwrap()

		if (response.success) {
			toast.success(response.message)
		} else {
			toast.error(response.message)
		}
	}

	const onCloseStateHandler = () => {
		const isClosed = watch("inOperation")
		if (isClosed === "폐업") {
			alert("이미 폐업된 가맹점 입니다.")
			return
		}

		const accept = confirm("폐업으로 변경 하시겠습니까?")

		if (!accept) {
			return
		}

		let closeDateInput = prompt(
			"폐업 일자를 입력 해주세요. ex) 2022-11-22",
			formattedToday,
		)
		const dateRegexp = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
		const isRegMatch = closeDateInput.match(dateRegexp)
		if (!isRegMatch) {
			alert("형식에 맞지 않습니다. 다시 입력 해주세요. ex) 2022-11-22")
			closeDateInput = prompt(
				"폐업 일자를 입력 해주세요. ex) 2022-11-22",
				formattedToday,
			)
		}

		alert(`${closeDateInput}로 폐업처리 합니다. 수정완료 해주세요.`)

		setValue("closeDate", closeDateInput)
		setValue("inOperation", "폐업")

		return
	}

	const onStoreDeleteHandler = async () => {
		const accept = confirm(
			"가맹점을 삭제하면 복구할 수 없습니다. 진행 하시겠습니까?",
		)

		if (!accept) {
			return
		}

		const storeId = item._id

		const response = await deleteStore({ storeId }).unwrap()

		if (response.success) {
			toast.success(response.message)
			updateStoreModal.onClose()
		} else {
			alert(response.data.message)
		}
	}

	const modalBodyContent = (
		<>
			{item && (
				<form onSubmit={handleSubmit(editStoreSubmitHandler)} className="">
					<div className="w-full  grid grid-cols-5 gap-2">
						<div className="col-span-3 lg:col-span-2">
							<Input
								label="계약일자"
								id="contractDate"
								type="date"
								register={register}
								errors={errors}
							/>
							<Input
								label=""
								id="closeDate"
								type="hidden"
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<ListboxButton
								placeholder="담당자"
								control={control}
								options={users}
								name="user"
							/>
						</div>
						<div className="col-span-3 lg:col-span-1">
							<ListboxButton
								placeholder="VAN"
								control={control}
								options={vanItems}
								name="van"
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<ListboxButton
								placeholder="영업상태"
								control={control}
								options={inOperationItems}
								name="inOperation"
								// onChange={(item) => onCloseStateHandler(item)}
							/>
						</div>
						<div className="col-span-5 lg:col-span-3">
							<Input
								id="storeName"
								label="상호명"
								required
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<Input
								maxLength={10}
								id="businessNum"
								label="사업자번호"
								required
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<ListboxButton
								placeholder=""
								control={control}
								options={cityItems}
								name="city"
							/>
						</div>
						<div className="col-span-5 lg:col-span-4">
							<Input
								id="address"
								label="주소"
								required
								register={register}
								errors={errors}
							/>
						</div>

						<div className="col-span-2 lg:col-span-2">
							<Input
								id="owner"
								label="대표자명"
								required
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<Input
								id="contact"
								label="연락처"
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-5 lg:col-span-1">
							<Input
								id="cms"
								label="CMS"
								required
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-5">
							<StoreProductCheckbox control={control} name="product" />
						</div>

						<div className="col-span-2">
							<Input
								id="vanCode"
								label="VAN Code"
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-3">
							<Input
								id="vanId"
								label="VAN ID"
								register={register}
								errors={errors}
							/>
						</div>
						<div className="col-span-5 h-full">
							<textarea
								placeholder="비고"
								className="
                                    w-full 
                                    border-2 
                                    rounded-md
                                    pl-2
                                    pt-2
                                    resize-none
                                "
								id="note"
								{...register("note", { maxLength: 500 })}
								rows={6}
							></textarea>
						</div>
						<div className="col-span-5 flex gap-2">
							<div className={`w-full hidden lg:block`}>
								<Button
									outline
									label="가맹점 삭제"
									type="button"
									onClick={onStoreDeleteHandler}
								/>
							</div>

							<div className={`w-full hidden lg:block`}>
								<Button
									outline
									disabled={item.inOperation === "폐업"}
									label="폐업"
									type="button"
									onClick={onCloseStateHandler}
								/>
							</div>
							<Button label="저장" type="submit" />
						</div>
					</div>
				</form>
			)}
		</>
	)

	return (
		<Modal
			title="가맹점 정보"
			onClose={updateStoreModal.onClose}
			isOpen={updateStoreModal.isOpen}
			body={modalBodyContent}
		/>
	)
}

export default UpdateStoreModal
