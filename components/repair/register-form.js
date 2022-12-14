import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { DatalistInput } from "react-datalist-input"
import { useRouter } from "next/router"
import { getAllProductsForDatalist } from "../../lib/util/product-util"
import { api } from "../../query/api"
import { format } from "date-fns"

function RepairRegisterForm() {
	const productList = getAllProductsForDatalist()
	const [plainFetcher] = api.usePlainFetcherMutation()

	const today = new Date()
	const year = format(today, "yyyy")
	const month = format(today, "MM")
	const day = format(today, "dd")
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
	const symptomInputRef = useRef()

	async function submitHandler(e) {
		e.preventDefault()

		const productQtyRefvalue = productQtyInputRef.current.value
		const storeNameRefValue = storeNameInputRef.current.value
		const productNumRefValue = productNumInputRef.current.value
		const invoiceNumRefValue = invoiceNumInputRef.current.value || ""
		const symptomRefValue = symptomInputRef.current.value
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
		const symptom = symptomRefValue

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
			symptom,
			brand,
		}
		const accept = confirm("?????? ???????????????????")
		if (!accept) {
			return
		}

		const { data } = await plainFetcher({ url: "repair", method: "POST", body })

		alert(data.message)

		if (data.success) {
			router.reload()
		}
	}

	function dataListSelectHandler(item) {
		setSelectedProductId(item.id)
		setSelectedProductCompany(item.companyId)
		setSelectedCompanyName(item.company)
		setSelectedBrand(item.brand)
	}
	return (
		<section className="container lg:w-2/5 ">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
				<div className="col-span-4">
					<label className="input-label" htmlFor="date">
						??????
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
						label={<div className="input-label">????????????</div>}
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
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="qty">
						??????
					</label>
					<input
						className="input-text"
						id="qty"
						type="number"
						ref={productQtyInputRef}
						required
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="company">
						?????????
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
						????????????
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
						????????????
					</label>

					<textarea
						className="input-textarea h-12"
						id="product-num"
						maxLength={200}
						rows={1}
						ref={productNumInputRef}
					></textarea>
				</div>

				<div className="col-span-2">
					<label className="input-label" htmlFor="invoice-num">
						????????????
					</label>
					<input
						className="input-text"
						id="invoice-num"
						type="text"
						ref={invoiceNumInputRef}
					/>
				</div>
				<div className="col-span-4">
					<label className="input-label" htmlFor="symptom">
						????????????
					</label>
					<textarea
						className="input-textarea"
						id="symptom"
						maxLength={200}
						rows={3}
						ref={symptomInputRef}
					></textarea>
				</div>
				<div className="col-span-4">
					<label className="input-label" htmlFor="note">
						??????
					</label>
					<textarea
						className="input-textarea"
						id="note"
						maxLength={200}
						rows={3}
						ref={noteInputRef}
						placeholder={"????????? ???????????? ??????????????? "}
					></textarea>
				</div>
				<div className="col-span-4">
					<button className="input-button" type="submit">
						??????
					</button>
				</div>
			</form>
		</section>
	)
}
export default RepairRegisterForm
