import { format } from "date-fns"
import PageTitle from "../../components/ui/page-title"
import { useAddStoreMutation } from "../../query/storeApi"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import { editUserforDropdown } from "../../lib/util/dropdown-util"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import Loader from "../../components/ui/loader"
import { Dropdown } from "../../components/ui/dropdown"
import { StoreProductCheckbox } from "../../components/ui/store-product-checkbox"
import {
	cityItems,
	isBackupItems,
	vanItems,
} from "../../lib/variables/variables"
import { toast } from "react-toastify"

const StoreRegisterPage = () => {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const [addStore] = useAddStoreMutation()
	const { data, isLoading } = useGetAllItemsByUrlQuery({ url: "user" })
	const editedUsers = editUserforDropdown(data?.users)
	const { data: session } = useSession()

	const { register, reset, handleSubmit, control } = useForm({
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
				van: vanItems[1].value,
				isBackup: isBackupItems[0].value,
				city: cityItems[0].value,
				contractDate: formattedToday,
				cms: 0,
			})
		}

		// editedUsers 의존성 추가하면 페이지 안넘어가고 동작 안하는 버그 발생 함
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

		const { data: response } = await addStore(body)

		if (response.success === false) {
			toast.error(response.message)
			console.log(response.error)
			return
		}

		toast.success(response.message)

		reset({
			user: session.user.name,
			van: vanItems[1].value,
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

		return
	}
	return (
		<>
			<PageTitle title="가맹점 등록" />
			<section className="container lg:w-1/2 ">
				{isLoading && <Loader />}
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="grid grid-cols-4 gap-4"
				>
					<div className="col-span-4 lg:col-span-1">
						<label className="input-label" htmlFor="contract-date">
							계약일자
						</label>
						<input
							className="input-text"
							id="contract-date"
							type="date"
							{...register("contractDate", { required: true })}
						/>
					</div>
					<div className="col-span-4 lg:col-span-2">
						<label className="input-label" htmlFor="store-name">
							가맹점명
						</label>
						<input
							className="input-text"
							id="store-name"
							type="text"
							{...register("storeName", { required: true })}
						/>
					</div>
					<div className="col-span-4 lg:col-span-1">
						<label className="input-label" htmlFor="business-number">
							사업자번호
						</label>
						<input
							className="input-text"
							id="business-number"
							type="text"
							maxLength={10}
							{...register("businessNum", { required: true, maxLength: 10 })}
						/>
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="owner">
							대표자명
						</label>
						<input
							className="input-text"
							id="owner"
							type="text"
							{...register("owner", { required: true })}
						/>
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="user">
							담당자
						</label>
						<Dropdown control={control} options={editedUsers} name="user" />
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="contact">
							연락처
						</label>
						<input
							className="input-text"
							id="contact"
							type="text"
							{...register("contact")}
						/>
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="cms">
							CMS
						</label>
						<input
							className="input-text"
							id="cms"
							type="number"
							{...register("cms", { required: true })}
						/>
					</div>

					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="city">
							주소(도시)
						</label>
						<Dropdown control={control} options={cityItems} name="city" />
					</div>
					<div className="col-span-4 lg:col-span-3">
						<label className="input-label" htmlFor="address">
							주소
						</label>
						<input
							className="input-text"
							id="address"
							type="text"
							{...register("address", { required: true })}
						/>
					</div>

					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="isbackup">
							메인/백업
						</label>
						<Dropdown
							control={control}
							options={isBackupItems}
							name="isBackup"
						/>
					</div>

					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="van">
							VAN
						</label>
						<Dropdown control={control} options={vanItems} name="van" />
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="van-id">
							VAN CODE
						</label>
						<input
							className="input-text"
							id="van-id"
							type="text"
							{...register("vanCode", { required: true })}
						/>
					</div>
					<div className="col-span-2 lg:col-span-1">
						<label className="input-label" htmlFor="van-id">
							VAN ID
						</label>
						<input className="input-text" id="van-id" {...register("vanId")} />
					</div>

					<div className="col-span-4">
						<div className="input-label">장비</div>
						<div className="flex justify-between">
							<StoreProductCheckbox control={control} name="product" />
						</div>
					</div>

					<div className="col-span-4">
						<label className="input-label" htmlFor="note">
							비고
						</label>
						<textarea
							className="input-textarea"
							id="note"
							{...register("note", { maxLength: 500 })}
							rows={3}
						></textarea>
					</div>
					<div className="col-span-4">
						<button className="input-button" type="submit">
							등록
						</button>
					</div>
				</form>
			</section>
		</>
	)
}

export default StoreRegisterPage
