import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { cityItems, inOperationItems } from "../../lib/variables/variables"
import { CheckboxButton } from "../ui/checkbox-button"
import { vanItems } from "../../lib/variables/variables"
import { DownArrow } from "../ui/icons/arrows"
import { format } from "date-fns"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import {
	useGetStoreByIdQuery,
	useAddStoreAsMutation,
	useUpdateStoreMutation,
	useGetAllItemsByUrlQuery,
} from "../../query/api"
import Dropdown from "react-dropdown"

function StoreItemDetail({ storeId, modalHandler }) {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")
	const { data: session } = useSession()

	const { data } = useGetStoreByIdQuery({ storeId })
	const item = data?.store

	const [addStoreAs] = useAddStoreAsMutation()
	const [updateStore] = useUpdateStoreMutation()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const editedUsers = editItemforDropdownButton(allUsersData?.users)

	const [isEditable, setIsEditable] = useState(false)
	const [contractDate, setContractDate] = useState("2000-01-01")
	const [storeName, setStoreName] = useState("")
	const [businessNum, setBusinessNum] = useState(0)
	const [city, setCity] = useState("")
	const [address, setAddress] = useState("")
	const [contact, setContact] = useState("")
	const [user, setUser] = useState("")
	const [users, setUsers] = useState([])
	const [van, setVan] = useState("")
	const [vanId, setVanId] = useState("")
	const [vanCode, setVanCode] = useState("")
	const [inOperation, setInOperation] = useState("")
	const [cms, setCms] = useState(0)
	const [product, setProduct] = useState({})
	const [owner, setOwner] = useState("")
	const [note, setNote] = useState("")
	const [asNote, setAsNote] = useState([])
	const [asNoteDate, setAsNoteDate] = useState("")
	const [asNoteValue, setAsNoteValue] = useState("")
	const [closeDate, setCloseDate] = useState("")

	useEffect(() => {
		if (item) {
			setVan(item.van)
			setCity(item.city)
			setUser(item.user)
			setNote(item.note)
			setAsNote(item.asNote)
			setContractDate(item.contractDate)
			setStoreName(item.storeName)
			setBusinessNum(filteredBusinessNum(item.businessNum))
			setAddress(item.address)
			setContact(item.contact)
			setVanId(item.vanId)
			setVanCode(item.vanCode)
			setCms(item.cms)
			setProduct(item.product)
			setOwner(item.owner)
			setInOperation(item.inOperation)
			setAsNoteDate(formattedToday)
			setUsers(editedUsers)
		}

		if (isEditable) {
			// if (item && item.inOperation === "??????") {
			// 	alert("?????? ???????????? ?????? ??? ??? ????????????.")
			// 	setIsEditable(false)
			// }
			// ???????????? ????????? ??? ??????????????? ?????? - ??? ??????
			setBusinessNum(businessNum.replace(/-/g, ""))
		}
	}, [item, isEditable, filteredBusinessNum, formattedToday])

	const filteredBusinessNum = useCallback(
		(plainNumber) => {
			if (!isEditable) {
				const parsedPlainNumber = String(plainNumber)
				const filteredNumber = `${parsedPlainNumber.slice(
					0,
					3,
				)}-${parsedPlainNumber.slice(3, 5)}-${parsedPlainNumber.slice(5, 10)}`

				return filteredNumber
			}
		},
		[isEditable],
	)

	const cancelSubmitHandler = () => {}

	const editStoreSubmitHandler = async (e) => {
		e.preventDefault()

		// todo : ??????????????? 10?????? ??? ??????.
		if (businessNum.length != 10) {
			alert("?????????????????? 10?????? ?????????.")
			return
		}

		const accept = confirm("????????? ?????? ???????????????????")

		if (!accept) {
			return
		} else {
			const body = {
				_id: item._id,
				user: user.label,
				storeName,
				contractDate,
				businessNum,
				city: city.value,
				address,
				contact,
				van: van.value,
				vanId,
				vanCode,
				inOperation,
				cms,
				product,
				owner,
				note,
				closeDate,
			}

			const { data: response } = await updateStore(body)
			if (response.success) {
				alert(response.message)
				setIsEditable(!isEditable)
			} else {
				alert(response.message)
			}
		}
	}

	const asNoteSubmitHandler = async (e) => {
		const accept = confirm("??????????????? ?????? ???????????????????")
		if (!accept) {
			return
		} else {
			e.preventDefault()

			const body = {
				storeId: item._id,
				writerName: session.user.name,
				date: asNoteDate,
				note: asNoteValue,
			}
			const { data: response } = await addStoreAs(body)
			if (response.success) {
				alert(response.message)
				setAsNoteValue("")
			} else {
				alert(response.message)
			}
		}
	}

	const onCloseStateHandler = (selectedItem) => {
		const { value } = selectedItem
		if (value === "??????") {
			const accept = confirm("???????????? ?????? ???????????????????")

			if (!accept) {
				// ?????? ?????? ???????????? ?????? ???????????? ???????????? ?????? ????????? ?????????..
				const oldInOperation = item.inOperation
				setInOperation(oldInOperation)
				setItem((prev) => prev)

				return
			}

			const closeDateInput = prompt(
				"?????? ????????? ?????? ????????????. ex) 2022-11-22",
				formattedToday,
			)

			alert(`${closeDateInput}??? ???????????? ?????????. ???????????? ????????????.`)
			setCloseDate(closeDateInput)
			setInOperation(value)
			return
		}

		setInOperation(value)
		return
	}

	return (
		<div className="w-full container">
			{item && (
				<div
					className="flex flex-col p-3 
					lg:flex-row lg:justify-between lg:divide-x lg:divide-gray-300  lg:w-[80rem]"
					onKeyDown={(e) => console.log(e)}
				>
					<div
						className="w-full p-1 lg:m-3 grid grid-cols-5 gap-3
									lg:gap-4"
					>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label " htmlFor="contract-date">
								????????????
							</label>
							<input
								className="input-text"
								id="contract-date"
								type="date"
								value={contractDate || ""}
								onChange={(event) => setContractDate(event.target.value)}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">?????????</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={users}
								disabled={!isEditable}
								value={user}
								onChange={setUser}
							/>
						</div>
						<div className="col-span-3 lg:col-span-1">
							<label className="input-label">VAN</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={vanItems}
								onChange={setVan}
								value={van}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">????????????</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={inOperationItems}
								disabled={!isEditable}
								value={inOperation}
								onChange={(item) => onCloseStateHandler(item)}
							/>
						</div>
						<div className="col-span-5 lg:col-span-3">
							<label className="input-label">?????????</label>
							<input
								className="input-text"
								value={storeName}
								onChange={(e) => setStoreName(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">???????????????</label>
							<input
								className="input-text"
								value={businessNum}
								maxLength={10}
								onChange={(e) => setBusinessNum(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">??????</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={cityItems}
								value={city}
								onChange={setCity}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5 lg:col-span-4">
							<label className="input-label">??????</label>
							<input
								className="input-text"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>

						<div className="col-span-2 lg:col-span-2">
							<label className="input-label">????????????</label>
							<input
								className="input-text"
								value={owner}
								onChange={(e) => setOwner(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">?????????</label>
							<input
								className="input-text"
								value={contact || ""}
								onChange={(e) => setContact(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5 lg:col-span-1">
							<label className="input-label">CMS</label>
							<input
								className="input-text"
								value={cms}
								onChange={(e) => setCms(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5">
							<div className="input-label">??????</div>
							<div className="flex">
								<CheckboxButton
									id="pos"
									disabled={!isEditable}
									value={product}
									onChangeFunction={setProduct}
									title="??????"
								/>
								<CheckboxButton
									id="kiosk"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="????????????"
								/>
								<CheckboxButton
									id="printer"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="???????????????"
								/>
								<CheckboxButton
									id="cat"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="?????????"
								/>
								<CheckboxButton
									id="router"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="?????????"
								/>
							</div>
						</div>

						<div className="col-span-2">
							<label className="input-label">VAN Code</label>
							<input
								className="input-text"
								value={vanCode || ""}
								onChange={(e) => setVanCode(e.target.value)}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3">
							<label className="input-label">VAN ID</label>
							<input
								className="input-text"
								value={vanId || ""}
								onChange={(e) => setVanId(e.target.value)}
								disabled={!isEditable}
							/>
						</div>
					</div>
					<div className="w-full  p-3 grid grid-cols-5 gap-3">
						<div className="col-span-5">
							<label className="input-label">??????</label>
							<textarea
								rows={6}
								value={note || ""}
								onChange={(e) => setNote(e.target.value)}
								disabled={!isEditable}
								className="input-textarea"
							></textarea>
						</div>
						<div className="col-span-5 flex flex-col justify-between ">
							<div>
								<label className="input-label  border-b-2 border-gray-transparent">
									????????????
								</label>

								<div
									className={`mt-3 mb-3   border-gray-300 rounded-md p-2 overflow-auto  max-h-60
									${asNote.length < 1 ? "" : "border"}`}
								>
									{asNote &&
										asNote
											.slice()
											.reverse()
											.map((item, index) => (
												<div
													key={index}
													className="flex-col justify-between mb-2"
												>
													<div className="mb-1">
														<span className=" text-sm ">
															{item.writerName}{" "}
														</span>
														<span className="text-sm text-gray-300">
															{item.date}
														</span>
													</div>
													<div className="pl-2">{item.note}</div>
												</div>
											))}
								</div>
							</div>
							<div>
								<form
									className="flex flex-col lg:flex-row"
									onSubmit={asNoteSubmitHandler}
								>
									<input
										className="input-text h-9 w-full lg:w-1/3 mr-2"
										id="asNote-date"
										type="date"
										value={asNoteDate}
										onChange={(event) => setAsNoteDate(event.target.value)}
										required
									/>
									<input
										type="text"
										value={asNoteValue}
										onChange={(event) => setAsNoteValue(event.target.value)}
										className="px-4 h-9 my-1 block w-full  rounded-md border border-gray-300 
												shadow-lg lg:text-sm focus:border-primary focus:ring-2  
												focus:ring-primary focus:outline-none"
									/>
								</form>
							</div>
							<div className="col-span-5 flex items-end h-fit">
								<div className="w-full mr-1 mb-2">
									<button
										className={`input-button w-full  `}
										onClick={
											isEditable
												? (e) => editStoreSubmitHandler(e)
												: () => setIsEditable(!isEditable)
										}
									>
										{isEditable ? "????????????" : "????????????"}
									</button>
								</div>
								<div className="w-full ml-1 mb-2">
									<button
										className={`input-button w-full ${
											isEditable ? "hidden" : "block"
										}`}
										onClick={modalHandler}
									>
										??????
									</button>
									<button
										className={`input-button w-full ${
											isEditable ? "block" : "hidden"
										}`}
										onClick={() => setIsEditable(!isEditable)}
									>
										??????
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default StoreItemDetail
