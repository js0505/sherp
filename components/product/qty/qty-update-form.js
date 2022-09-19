import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import DatalistInput from "react-datalist-input"
import { fetchHelperFunction } from "../../../lib/fetch/json-fetch-data"

function QtyUpdateForm(props) {
	const { qtyUpdate, productList } = props
	const { data: session } = useSession()

	const [selectedProductId, setSelectedProductId] = useState()
	const [selectedCalcValue, setSelectedCalcValue] = useState("plus")

	const qtyInputRef = useRef()
	const noteInputRef = useRef()

	function dataListSelectHandler(item) {
		setSelectedProductId(item.id)
	}

	async function submitHandler(e) {
		e.preventDefault()

		const productId = selectedProductId
		const calc = selectedCalcValue
		const userId = session.user.image._id
		const note = noteInputRef.current.value
		const qty = qtyInputRef.current.value

		const body = { user: userId, productId, calc, note, qty: Number(qty) }

		const accept = confirm("재고를 변경 하시겠습니까?")

		if (!accept) {
			return
		} else {
			const response = await fetchHelperFunction("PATCH", "/api/qty", body)

			if (!response.success) {
				alert(response.message)
			} else {
				alert(response.message)
				noteInputRef.current.value = ""
				qtyInputRef.current.value = ""
				setSelectedProductId("")
				setSelectedCalcValue("")
			}
		}
	}

	return (
		<section className="container lg:w-3/4 pt-3 ">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
				<div className="col-span-4 sm:col-span-4">
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
				<div className="col-span-4 sm:col-span-2">
					<label className="input-label " htmlFor="calc">
						입/출고
					</label>
					<div className="flex justify-between">
						<label
							className={`input-radio-label ${
								selectedCalcValue === "plus" ? "bg-primary text-white" : ""
							}`}
							htmlFor="plus"
						>
							<input
								className="input-radio "
								id="plus"
								type="radio"
								value="plus"
								name="calc"
								checked={selectedCalcValue === "plus"}
								onChange={() => setSelectedCalcValue("plus")}
							/>
							입고
						</label>

						<label
							className={`input-radio-label ${
								selectedCalcValue === "minus" ? "bg-primary text-white" : ""
							}`}
							htmlFor="minus"
						>
							<input
								className="input-radio"
								value="minus"
								name="calc"
								id="minus"
								type="radio"
								checked={selectedCalcValue === "minus"}
								onChange={() => setSelectedCalcValue("minus")}
							/>
							출고
						</label>
					</div>
				</div>
				<div className="col-span-4 sm:col-span-2">
					<label className="input-label" htmlFor="qty">
						수량
					</label>
					<input
						className="input-text"
						id="qty"
						type="number"
						ref={qtyInputRef}
						required
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
						required
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

export default QtyUpdateForm
