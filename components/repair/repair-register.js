import { useState } from "react"
import { useSession } from "next-auth/react"
import { DatalistInput } from "react-datalist-input"
import { getAllProductsForDatalist } from "../../lib/util/product-util"
import { usePlainFetcherMutation } from "../../query/api"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useAddRepairItemMutation } from "../../query/repairApi"

function RepairRegisterForm() {
	const productList = getAllProductsForDatalist()
	// const [plainFetcher] = usePlainFetcherMutation()
	const [addRepairItem] = useAddRepairItemMutation()

	const today = new Date()
	const year = format(today, "yyyy")
	const month = format(today, "MM")
	const day = format(today, "dd")
	const dateString = year + "-" + month + "-" + day

	const { data: session } = useSession()

	const { register, reset, handleSubmit } = useForm({
		mode: "onSubmit",
		defaultValues: {
			qty: "",
			storeName: "",
			productNum: "",
			invoiceNum: "",
			symptom: "",
			note: "",
		},
	})

	const [dateInput, setDateInput] = useState(dateString)
	const [selectedCompanyName, setSelectedCompanyName] = useState(null)
	const [selectedProductCompany, setSelectedProductCompany] = useState(null)
	const [selectedProductId, setSelectedProductId] = useState()
	const [selectedBrand, setSelectedBrand] = useState(null)
	const [datalistValue, setDatalistValue] = useState()

	async function submitHandler(formData) {
		const user = session.user.name
		const date = dateInput
		const product = selectedProductId
		const productCompany = selectedProductCompany
		const brand = selectedBrand

		const body = {
			date,
			product,
			user,
			productCompany,
			brand,
			...formData,
		}
		const accept = confirm("등록 하시겠습니까?")
		if (!accept) {
			return
		}

		const { data: response } = await addRepairItem({
			body,
		})

		if (!response.success) {
			toast.error(response.message)
			console.log(response.error)
			return
		}
		toast.success(response.message)

		reset()
		setSelectedBrand(null)
		setSelectedProductId(null)
		setSelectedProductCompany(null)
		setSelectedCompanyName(null)
		setDateInput(dateString)
		setDatalistValue("")
	}

	function dataListSelectHandler(item) {
		setSelectedProductId(item.id)
		setSelectedProductCompany(item.companyId)
		setSelectedCompanyName(item.company)
		setSelectedBrand(item.brand)
	}
	return (
		<section className="container lg:w-1/2 ">
			<form
				onSubmit={handleSubmit(submitHandler)}
				className="grid grid-cols-4 gap-4"
			>
				<div className="col-span-4">
					<label className="input-label" htmlFor="date">
						날짜
					</label>
					<input
						className="input-text"
						id="date"
						type="date"
						value={dateInput}
						onChange={(event) => setDateInput(event.target.value)}
						required
					/>
				</div>
				<div className="col-span-4 lg:col-span-2">
					<DatalistInput
						className="relative"
						label={<div className="input-label">제품선택</div>}
						onSelect={(item) => dataListSelectHandler(item)}
						items={productList}
						value={datalistValue}
						onChange={(e) => setDatalistValue(e.target.value)}
						required
						inputProps={{ className: " input-text " }}
						listboxOptionProps={{
							className:
								" px-2 py-2 h-10 hover:bg-primary hover:text-white  w-full",
						}}
						isExpandedClassName="absolute border border-gray-300 rounded-md   bg-white w-full max-h-40 overflow-auto "
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="qty">
						수량
					</label>
					<input
						className="input-text"
						id="qty"
						type="number"
						{...register("qty", { required: true })}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="company">
						제조사
					</label>
					<input
						className="input-text"
						id="company"
						type="text"
						value={selectedCompanyName || ""}
						disabled
					/>
				</div>

				<div className="col-span-4">
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
				<div className="col-span-2">
					<label className="input-label" htmlFor="product-num">
						제품번호
					</label>

					<textarea
						className="input-textarea h-10"
						id="product-num"
						maxLength={200}
						rows={1}
						{...register("productNum", { required: true })}
					></textarea>
				</div>

				<div className="col-span-2">
					<label className="input-label" htmlFor="invoice-num">
						송장번호
					</label>
					<input
						className="input-text"
						id="invoice-num"
						type="text"
						{...register("invoiceNum")}
					/>
				</div>
				<div className="col-span-4">
					<label className="input-label" htmlFor="symptom">
						고장증상
					</label>
					<textarea
						className="input-textarea"
						id="symptom"
						maxLength={200}
						rows={3}
						{...register("symptom")}
					></textarea>
				</div>
				<div className="col-span-4">
					<label className="input-label" htmlFor="note">
						비고
					</label>
					<textarea
						className="input-textarea"
						id="note"
						maxLength={200}
						rows={3}
						{...register("note")}
						placeholder={"내용과 수리처를 남겨주세요 "}
					></textarea>
				</div>
				<div className="col-span-4">
					<button className="input-button" type="submit">
						등록
					</button>
				</div>
			</form>
		</section>
	)
}
export default RepairRegisterForm
