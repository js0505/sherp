import { format } from "date-fns"
import { useAddStoreMutation } from "../../query/storeApi"
import { FieldValues, useForm } from "react-hook-form"
import { useEffect } from "react"
import { StoreProductCheckbox } from "../ui/StoreProductCheckbox"
import {
	cityItems,
	isBackupItems,
	vanItems,
} from "../../lib/variables/variables"
import { toast } from "react-toastify"
import Modal from "./Modal"
import useRegisterStoreModal from "@/hooks/useRegisterStoreModal"
import Input from "../inputs/Input"
import ListboxButton from "../Listbox"
import Button from "../Button"
import { useSession } from "next-auth/react"

interface Props {
	users: [
		{
			value: string
			label: string
		},
	]
}

const RegisterStoreModal = (props: Props) => {
	const { users } = props

	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")
	const registerStoreModal = useRegisterStoreModal()

	const [addStore] = useAddStoreMutation()
	const { data: session } = useSession()

	const {
		register,
		reset,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			storeName: "",
			businessNum: "",
			vanId: "",
			vanCode: "",
			owner: "",
			address: "",
			contact: "",
			cms: 0,
			contractDate: formattedToday,
			note: "",
			product: {
				pos: false,
				kiosk: false,
				printer: false,
				cat: false,
				router: false,
			},
			user: "",
			city: "",
			isBackup: "",
			van: "",
		},
	})

	useEffect(() => {
		if (session) {
			reset({
				user: session.user.name,
				van: vanItems[0].value,
				isBackup: isBackupItems[0].value,
				city: cityItems[0].value,
				contractDate: formattedToday,
				cms: 0,
				product: {
					pos: false,
					kiosk: false,
					printer: false,
					cat: false,
					router: false,
				},
			})
		}
	}, [session])

	async function submitHandler(formData) {
		// todo: 사업자번호로 검색해서 이미 존재하는 가맹점인지 확인하고 계속 저장할지 묻는 로직 생성.

		formData.isBackup = formData.isBackup === "메인" ? false : true

		const body = {
			...formData,
		}

		const accept = confirm("가맹점을 등록 하시겠습니까?")

		if (!accept) {
			return
		}

		const response = await addStore(body).unwrap()

		if (response.success === false) {
			toast.error(response.message)
			console.log(response.error)
			return
		}

		toast.success(response.message)

		reset({
			user: session.user.name,
			van: vanItems[0].value,
			isBackup: isBackupItems[0].value,
			city: cityItems[0].value,
			contractDate: formattedToday,
			cms: 0,
			storeName: "",
			businessNum: "",
			owner: "",
			contact: "",
			address: "",
			vanCode: "",
			vanId: "",
			note: "",
			product: {
				pos: false,
				kiosk: false,
				printer: false,
				cat: false,
				router: false,
			},
		})
	}

	const modalBodyContent = (
		<>
			<section>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="
                        grid
                        grid-cols-12
                        gap-4
                    "
				>
					<div
						className="
                            col-span-4
                        "
					>
						<Input
							id="contractDate"
							label="계약일자"
							type="date"
							required
							errors={errors}
							register={register}
						/>
					</div>

					<div
						className="
                            col-span-5
                        "
					>
						<Input
							id="storeName"
							label="가맹점명"
							type="text"
							required
							errors={errors}
							register={register}
						/>
					</div>

					<div
						className="
                            col-span-3
                        "
					>
						<Input
							id="businessNum"
							label="사업자번호"
							type="text"
							required
							errors={errors}
							register={register}
							options={{
								maxLength: {
									value: 10,
									message: "최대 10자리 까지 입력 가능합니다.",
								},
							}}
						/>
					</div>

					<div
						className="
                            col-span-3
                        "
					>
						<Input
							id="owner"
							label="대표자명"
							type="text"
							errors={errors}
							required
							register={register}
						/>
					</div>

					<div
						className="
                            col-span-3
                        "
					>
						<ListboxButton
							control={control}
							options={users || [{ value: "", name: "" }]}
							placeholder="담당자"
							name="user"
						/>
					</div>

					<div
						className="
                            col-span-3
                        "
					>
						<Input
							register={register}
							errors={errors}
							id="contact"
							label="연락처"
							type="text"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<Input
							register={register}
							errors={errors}
							id="cms"
							label="CMS"
							required
							type="text"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<ListboxButton
							placeholder="도시"
							control={control}
							options={cityItems}
							name="city"
						/>
					</div>
					<div
						className="
                            col-span-9
                        "
					>
						<Input
							register={register}
							errors={errors}
							id="address"
							label="주소"
							required
							type="text"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<ListboxButton
							placeholder="메인/백업"
							control={control}
							options={isBackupItems}
							name="isBackup"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<ListboxButton
							placeholder="VAN"
							control={control}
							options={vanItems}
							name="van"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<Input
							register={register}
							errors={errors}
							id="vanCode"
							label="VAN CODE"
							type="text"
						/>
					</div>
					<div
						className="
                            col-span-3
                        "
					>
						<Input
							register={register}
							errors={errors}
							id="vanId"
							label="VAN ID"
							type="text"
						/>
					</div>
					<div
						className="
                            col-span-12
                        "
					>
						<div
							className="
                                pl-2
                                text-zinc-400
                            "
						>
							장비
						</div>
						<StoreProductCheckbox control={control} name="product" />
					</div>
					<div
						className="
                            col-span-12
                        "
					>
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
							rows={3}
						></textarea>
					</div>
					<div
						className="
                            col-span-3
                            col-start-10
                        "
					>
						<Button
							label="등록"
							type="submit"
							onClick={() => console.log("등록")}
						/>
					</div>
				</form>
			</section>
		</>
	)
	return (
		<Modal
			title="가맹점 등록"
			onClose={registerStoreModal.onClose}
			isOpen={registerStoreModal.isOpen}
			body={modalBodyContent}
		/>
	)
}
export default RegisterStoreModal
