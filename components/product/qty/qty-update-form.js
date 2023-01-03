import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import DatalistInput from "react-datalist-input"
import { format } from "date-fns"
import {
	usePlainFetcherMutation,
} from "../../../query/api"
import { getAllProductsForDatalist } from "../../../lib/util/product-util"

function QtyUpdateForm() {
	const productList = getAllProductsForDatalist()
	const { data: session } = useSession()

	const [plainFetcher] = usePlainFetcherMutation()

	const [selectedProductId, setSelectedProductId] = useState()
	const [selectedProductQty, setSelectedProductQty] = useState()
	const [selectedCalcValue, setSelectedCalcValue] = useState("plus")

	const qtyInputRef = useRef()
	const noteInputRef = useRef()
	const dataListRef = useRef()

	const dataListSelectHandler = (item) => {
		setSelectedProductId(item.id)
		setSelectedProductQty(item.qty)
	}

	const submitHandler = async (e) => {
		e.preventDefault()
		const today = new Date()
		const formattedToday = format(today, "yyyy-MM-dd")

		const productId = selectedProductId
		const calc = selectedCalcValue
		const userId = session.user.image._id
		const note = noteInputRef.current.value
		const qty = qtyInputRef.current.value
		const date = formattedToday

		let confirmQty
		if (calc === "plus") {
			confirmQty = selectedProductQty + Number(qty)
		} else {
			confirmQty = selectedProductQty - Number(qty)
			if (confirmQty < 0) {
				alert("기존 재고보다 출고 수량이 많습니다.")
				return
			}
		}
		const accept = confirm(`재고를 ${confirmQty}개로 수정 하시겠습니까?`)

		if (!accept) {
			return
		}

		const body = {
			user: userId,
			productId,
			calc,
			note,
			qty: Number(qty),
			date,
		}

		const { data: response } = await plainFetcher({
			url: "qty",
			method: "PATCH",
			body,
		})
		if (!response.success) {
			alert(response.message)
		}

		alert(response.message)
		noteInputRef.current.value = ""
		qtyInputRef.current.value = ""
		dataListRef.current.value = ""
		setSelectedProductId("")
		setSelectedCalcValue("plus")
	}

	return (
		<section className="container lg:w-2/5 pt-3 ">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
				<div className="col-span-4 lg:col-span-2">
					<DatalistInput
						className="relative"
						label={<div className="input-label">제품선택</div>}
						onSelect={(item) => dataListSelectHandler(item)}
						items={productList}
						ref={dataListRef}
						required
						inputProps={{ className: " input-text " }}
						listboxOptionProps={{
							className:
								" px-2 py-2 h-10 hover:bg-primary hover:text-white  w-full",
						}}
						isExpandedClassName="absolute border border-gray-300 rounded-md   bg-white w-full max-h-40 overflow-auto "
					/>
				</div>

				<div className="col-span-4 lg:col-span-2">
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
				<div className="col-span-2 lg:col-span-2">
					<label className="input-label" htmlFor="qty">
						기존 재고수량
					</label>
					<input
						className="input-text"
						id="qty"
						type="text"
						value={selectedProductQty === undefined ? "" : selectedProductQty}
						disabled
					/>
				</div>
				<div className="col-span-2 lg:col-span-2">
					<label className="input-label" htmlFor="qty">
						조정 수량
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
