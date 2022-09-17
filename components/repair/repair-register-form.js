import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { DatalistInput } from "react-datalist-input"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import { useRouter } from "next/router"

function RepairRegisterForm(props) {
	const { productList } = props
	const today = new Date()
	const year = today.getFullYear()
	const month = ("0" + (today.getMonth() + 1)).slice(-2)
	const day = ("0" + today.getDate()).slice(-2)
	const dateString = year + "-" + month + "-" + day

	const { data: session } = useSession()
	const router = useRouter()

	const [dateInput, setDateInput] = useState(dateString)
	const [selectedCompanyName, setSelectedCompanyName] = useState(null)
	const [selectedProductCompany, setSelectedProductCompany] = useState(null)
	const [selectedProductId, setSelectedProductId] = useState()
	const [selectedBrand, setSelectedBrand] = useState(null)

	const productQtyInputRef = useRef()
	const storeNameInputRef = useRef()
	const productNumInputRef = useRef()
	const invoiceNumInputRef = useRef()
	const noteInputRef = useRef()

	async function submitHandler(e) {
		e.preventDefault()

		const productQtyRefvalue = productQtyInputRef.current.value
		const storeNameRefValue = storeNameInputRef.current.value
		const productNumRefValue = productNumInputRef.current.value
		const invoiceNumRefValue = invoiceNumInputRef.current.value || ""
		const noteRefValue = noteInputRef.current.value
		const userId = session.user.image._id

		const date = dateInput
		const product = selectedProductId
		const user = userId
		const productCompany = selectedProductCompany
		const qty = productQtyRefvalue
		const storeName = storeNameRefValue
		const productNum = productNumRefValue
		const invoiceNum = invoiceNumRefValue
		const note = noteRefValue
		const brand = selectedBrand

		const body = {
			date,
			product,
			user,
			productCompany,
			qty,
			storeName,
			productNum,
			invoiceNum,
			note,
			brand,
		}
		const accept = confirm("등록 하시겠습니까?")
		if (!accept) {
			return
		} else {
			const data = await fetchHelperFunction("POST", "/api/repair", body)

			alert(data.message)

			if (data.success) {
				router.reload()
			}
		}
	}

	function dataListSelectHandler(item) {
		console.log(item)
		setSelectedProductId(item.id)
		setSelectedProductCompany(item.companyId)
		setSelectedCompanyName(item.company)
		setSelectedBrand(item.brand)
	}
	return (
		<section className="container lg:w-3/4">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
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
				<div className="col-span-4 sm:col-span-2">
					<DatalistInput
						className="relative"
						label={<div className="input-label">제품선택</div>}
						onSelect={(item) => dataListSelectHandler(item)}
						items={productList}
						required
						inputProps={{ className: " input-text " }}
						listboxOptionProps={{
							className:
								" px-2 py-2 h-10 hover:bg-primary hover:text-white  w-full",
						}}
						isExpandedClassName="absolute border border-gray-300 rounded-md   bg-white w-full max-h-40 overflow-auto "
					/>
				</div>
				<div className="col-span-2 sm:col-span-1">
					<label className="input-label" htmlFor="qty">
						수량
					</label>
					<input
						className="input-text"
						id="qty"
						type="number"
						ref={productQtyInputRef}
						required
					/>
				</div>
				<div className="col-span-2 sm:col-span-1">
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
						ref={storeNameInputRef}
						required
					/>
				</div>
				<div className="col-span-2">
					<label className="input-label" htmlFor="product-num">
						제품번호
					</label>
					<input
						className="input-text"
						id="product-num"
						type="text"
						ref={productNumInputRef}
						required
					/>
				</div>

				<div className="col-span-2">
					<label className="input-label" htmlFor="invoice-num">
						송장번호
					</label>
					<input
						className="input-text"
						id="invoice-num"
						type="text"
						ref={invoiceNumInputRef}
					/>
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
						ref={noteInputRef}
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
