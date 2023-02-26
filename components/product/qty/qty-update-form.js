import { useState } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import {
	useGetAllProductsForComboBoxQuery,
	useUpdateProductQtyMutation,
} from "../../../query/productApi"
import Loader from "../../ui/loader"
import { useController, useForm } from "react-hook-form"
import { Combobox } from "@headlessui/react"
import { DownChevronIcon } from "../../ui/icons/icons"
import { toast } from "react-toastify"

function QtyUpdateForm() {
	const { data: session } = useSession()
	const [query, setQuery] = useState("")
	const [updateProductQty] = useUpdateProductQtyMutation()
	const { data: productList, isLoading } = useGetAllProductsForComboBoxQuery()
	const filteredProductList =
		query === ""
			? productList
			: productList.filter((product) =>
					product.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, "")),
			  )

	const { control, register, handleSubmit, reset } = useForm({
		mode: "onSubmit",
		defaultValues: {
			product: "",
			calc: "plus",
			note: "",
			qty: "",
		},
	})

	const { field: productIdField } = useController({
		control,
		name: "product",
	})
	const { field: calcField } = useController({ control, name: "calc" })

	const submitHandler = async (formData) => {
		const { product, calc, note, qty } = formData
		const today = new Date()
		const formattedToday = format(today, "yyyy-MM-dd")

		const userName = session.user.name
		const date = formattedToday

		let confirmQty
		if (calc === "plus") {
			confirmQty = product.qty + Number(qty)
		} else {
			confirmQty = product.qty - Number(qty)
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
			user: userName,
			productId: product.value,
			calc,
			note,
			qty: Number(qty),
			date,
		}

		const { data: response } = await updateProductQty(body)
		if (!response.success) {
			toast.error(response.message)
		}

		toast.success(response.message)
		reset()
	}

	return (
		<section className="container lg:w-2/5 pt-3 ">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<form
						onSubmit={handleSubmit(submitHandler)}
						className="grid grid-cols-4 gap-4"
					>
						<div className="col-span-4 lg:col-span-2">
							<div className="input-label">제품선택</div>
							<Combobox
								value={productIdField.value}
								onChange={productIdField.onChange}
							>
								<div className="relative">
									<div className="relative w-full overflow-hidden ">
										<Combobox.Input
											className="px-4 h-12 mt-1 block w-full  rounded-md border border-gray-300 
														shadow-md text-base"
											displayValue={(item) => item.name}
											onChange={(event) => setQuery(event.target.value)}
										/>
										<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
											<DownChevronIcon
												className="h-4 w-4 text-gray-300"
												aria-hidden="true"
											/>
										</Combobox.Button>
									</div>
									<Combobox.Options className="absolute max-h-60 w-full overflow-auto mt-1 bg-white border rounded-md">
										{filteredProductList &&
											filteredProductList.map((product) => (
												<Combobox.Option
													key={product.value}
													value={product}
													className="relative cursor-pointer select-none py-2 px-2 
													hover:bg-primaryHover hover:bg-opacity-90 hover:text-white"
												>
													{product.name}
												</Combobox.Option>
											))}
									</Combobox.Options>
								</div>
							</Combobox>
						</div>

						<div className="col-span-4 lg:col-span-2">
							<label className="input-label " htmlFor="calc">
								입/출고
							</label>
							<div className="flex justify-between">
								<label
									className={`input-radio-label ${
										calcField.value === "plus" ? "bg-primary text-white" : ""
									}`}
									htmlFor="plus"
								>
									<input
										className="input-radio "
										id="plus"
										type="radio"
										name="calc"
										onChange={() => calcField.onChange("plus")}
									/>
									입고
								</label>

								<label
									className={`input-radio-label ${
										calcField.value === "minus" ? "bg-primary text-white" : ""
									}`}
									htmlFor="minus"
								>
									<input
										className="input-radio"
										name="calc"
										id="minus"
										type="radio"
										onChange={() => calcField.onChange("minus")}
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
								value={
									productIdField.value.qty === undefined
										? ""
										: productIdField.value.qty
								}
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
								{...register("qty")}
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
								{...register("note")}
								required
							></textarea>
						</div>

						<div className="col-span-4">
							<button className="input-button" type="submit">
								등록
							</button>
						</div>
					</form>
				</>
			)}
		</section>
	)
}

export default QtyUpdateForm
