import useDate from "@/hooks/useDate"
import useRegisterRepairModal from "@/hooks/useRegisterRepairModal"
import { useAddRepairItemMutation } from "@/query/repairApi"
import { Combobox } from "@headlessui/react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Button from "../Button"
import Input from "../inputs/Input"
import Modal from "./Modal"

type ProductsType = {
	id: string
	brand: string
	company: string
	conpanyId: string
	qty: number
	value: string
}
interface Props {
	products: ProductsType[]
}

function RegisterRepairModal({ products }: Props) {
	const dateString = useDate("yyyy-MM-dd")
	const [query, setQuery] = useState("")

	const { data: session } = useSession()
	const registerRepairModal = useRegisterRepairModal()
	const [addRepairItem] = useAddRepairItemMutation()

	const {
		register,
		reset,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			product: "",
			productCompany: "",
			qty: "",
			storeName: "",
			productNum: "",
			invoiceNum: "",
			note: "",
			symptom: "",
			date: dateString,
			// 재고 수량조정 때문에 브랜드 있는지 백엔드에서 확인 해야 해서 보냄
			brand: "",
			selectedProduct: {},
			selectedProductName: "",
			// 재조사 보여주려고 사용하는 값
			selectedProductCompanyName: "",
		},
	})

	const selectedProductComboboxValue = watch("selectedProductName")

	const filteredProducts =
		query === ""
			? products
			: products.filter((product) => {
					return product.value.toLowerCase().includes(query.toLowerCase())
			  })

	const submitHandler = async (formData) => {
		const user = session.user.name

		const body = {
			user,
			...formData,
		}

		const accept = confirm("등록 하시겠습니까?")
		if (!accept) {
			return
		}

		const response = await addRepairItem({
			body,
		}).unwrap()

		if (!response.success) {
			toast.error(response.message)
			return
		}
		toast.success(response.message)

		reset()
	}

	const modalBodyContent = (
		<>
			<form
				onSubmit={handleSubmit(submitHandler)}
				className="grid grid-cols-4 gap-4"
			>
				<div className="col-span-4">
					<Input
						id="date"
						label="날짜"
						type="date"
						required
						errors={errors}
						register={register}
					/>
				</div>
				<div className="col-span-4 lg:col-span-2">
					<Combobox
						value={selectedProductComboboxValue}
						onChange={(value) => {
							setValue("selectedProduct", value)
							setValue("selectedProductName", value.value)
							setValue("selectedProductCompanyName", value.company)
							setValue("product", value.id)
							setValue("productCompany", value.companyId)
							setValue("brand", value.brand)
						}}
					>
						<div className="relative w-full h-full">
							<div className="absolute text-sm top-2 left-4 text-zinc-400">
								제품선택
							</div>
							<Combobox.Input
								onChange={(event) => setQuery(event.target.value)}
								className="w-full h-full pt-2 pl-6 bg-white border-2 rounded-md outline-none border-neutral-300 focus:border-sky-600"
							/>
							<Combobox.Options className="absolute z-50 w-full overflow-auto bg-white border-2 shadow-md cursor-pointer max-h-40">
								{filteredProducts.length === 0 && query !== "" ? (
									<span className="block h-10 pt-2 pl-4 opacity-60">
										검색 결과 없음
									</span>
								) : (
									filteredProducts.map((product) => (
										<Combobox.Option
											key={product.id}
											value={product}
											className="w-full h-10 pt-2 pl-4 border-b hover:text-white hover:bg-sky-600"
										>
											{product.value}
										</Combobox.Option>
									))
								)}
							</Combobox.Options>
						</div>
					</Combobox>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<Input
						id="qty"
						label="수량"
						type="number"
						required
						errors={errors}
						register={register}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<Input
						id="selectedProductCompanyName"
						label="제조사"
						required
						disabled
						errors={errors}
						register={register}
					/>
				</div>

				<div className="col-span-4">
					<Input
						id="storeName"
						label="가맹점명"
						required
						errors={errors}
						register={register}
					/>
				</div>
				<div className="col-span-2">
					<Input
						id="productNum"
						label="제품번호"
						required
						errors={errors}
						register={register}
					/>
				</div>

				<div className="col-span-2">
					<Input
						id="invoiceNum"
						label="송장번호"
						required
						errors={errors}
						register={register}
					/>
				</div>
				<div className="col-span-4">
					<textarea
						placeholder="고장증상"
						className="w-full pt-2 pl-2 border-2 rounded-md resize-none "
						id="symptom"
						maxLength={200}
						rows={3}
						{...register("symptom")}
					></textarea>
				</div>
				<div className="col-span-4">
					<textarea
						placeholder="비고 사항이나 담당자 연락처를 남겨주세요"
						className="w-full pt-2 pl-2 border-2 rounded-md resize-none "
						id="note"
						maxLength={200}
						rows={3}
						{...register("note")}
					></textarea>
				</div>
				<div className="col-span-4">
					<Button label="등록" type="submit" />
				</div>
			</form>
		</>
	)

	return (
		<Modal
			title="신규 수리 접수"
			body={modalBodyContent}
			onClose={registerRepairModal.onClose}
			isOpen={registerRepairModal.isOpen}
		/>
	)
}

export default RegisterRepairModal
