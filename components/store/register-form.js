import { format } from "date-fns"
import { useRef, useState } from "react"
import {
	cityItems,
	vanItems,
	isBackupItems,
	storeProductsInit,
} from "../../lib/variables/variables"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import Dropdown from "react-dropdown"
import { DownArrow } from "../ui/icons/arrows"
import { CheckboxButton } from "../ui/checkbox-button"
import { useAddStoreMutation, useGetAllItemsByUrlQuery } from "../../query/api"
function StoreRegisterForm() {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const [addStore] = useAddStoreMutation()
	const { data } = useGetAllItemsByUrlQuery({ url: "user" })
	const editedUsers = editItemforDropdownButton(data?.users)

	const [product, setProduct] = useState(storeProductsInit)
	const [isBackup, setIsBackup] = useState(isBackupItems[0])
	const [selectedVANName, setSelectedVANName] = useState(vanItems[0])
	const [selectedCity, setSelectedCity] = useState(cityItems[0])
	const [selectedUser, setSelectedUser] = useState()
	const [contractDate, setContractDate] = useState(formattedToday)

	const storeNameInputRef = useRef()
	const businessNumInputRef = useRef()
	const ownerInputRef = useRef()
	const contactInputRef = useRef()
	const vanIdInputRef = useRef()
	const vanCodeInputRef = useRef()
	const addressInputRef = useRef()
	const cmsInputRef = useRef()
	const noteInputRef = useRef()

	async function submitHandler(e) {
		e.preventDefault()

		const body = {
			user: selectedUser.label,
			storeName: storeNameInputRef.current.value,
			businessNum: Number(businessNumInputRef.current.value),
			van: selectedVANName.value,
			vanId: vanIdInputRef.current.value,
			vanCode: vanCodeInputRef.current.value,
			owner: ownerInputRef.current.value,
			city: selectedCity.value,
			address: addressInputRef.current.value,
			contact: contactInputRef.current.value,
			product: product,
			cms: cmsInputRef.current.value,
			contractDate: contractDate,
			note: noteInputRef.current.value,
			isBackup: isBackup.value,
		}

		const accept = confirm("???????????? ?????? ???????????????????")

		if (!accept) {
			return
		}

		const { data: response } = await addStore(body)

		if (!response.success) {
			alert(response.message)
			console.log(response.error)
			return
		}

		alert(response.message)

		setProduct(storeProductsInit)
		setIsBackup(isBackupItems[0])
		setSelectedVANName(vanItems[0])
		setSelectedCity(cityItems[0])
		setSelectedUser(editedUsers[0])
		setContractDate(formattedToday)
		storeNameInputRef.current.value = ""
		businessNumInputRef.current.value = ""
		ownerInputRef.current.value = ""
		contactInputRef.current.value = ""
		vanIdInputRef.current.value = ""
		vanCodeInputRef.current.value = ""
		addressInputRef.current.value = ""
		cmsInputRef.current.value = ""
		noteInputRef.current.value = ""

		return
	}

	return (
		<section className="container lg:w-2/5 ">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
				<div className="col-span-4 lg:col-span-1">
					<label className="input-label" htmlFor="contract-date">
						????????????
					</label>
					<input
						className="input-text"
						id="contract-date"
						type="date"
						value={contractDate}
						onChange={(event) => setContractDate(event.target.value)}
						required
					/>
				</div>
				<div className="col-span-4 lg:col-span-2">
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
				<div className="col-span-4 lg:col-span-1">
					<label className="input-label" htmlFor="business-number">
						???????????????
					</label>
					<input
						className="input-text"
						id="business-number"
						type="text"
						ref={businessNumInputRef}
						required
						maxLength={10}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="owner">
						????????????
					</label>
					<input
						className="input-text"
						id="owner"
						type="text"
						ref={ownerInputRef}
						required
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="user">
						?????????
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={editedUsers}
						value={selectedUser}
						onChange={setSelectedUser}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="contact">
						?????????
					</label>
					<input
						className="input-text"
						id="contact"
						type="text"
						ref={contactInputRef}
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
						ref={cmsInputRef}
						required
					/>
				</div>

				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="city">
						??????(??????)
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={cityItems}
						value={selectedCity}
						onChange={setSelectedCity}
					/>
				</div>
				<div className="col-span-4 lg:col-span-3">
					<label className="input-label" htmlFor="address">
						??????
					</label>
					<input
						className="input-text"
						id="address"
						type="text"
						ref={addressInputRef}
						required
					/>
				</div>

				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="isbackup">
						??????/??????
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={isBackupItems}
						value={isBackup}
						onChange={setIsBackup}
					/>
				</div>

				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="van">
						VAN
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={vanItems}
						value={selectedVANName}
						onChange={setSelectedVANName}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="van-id">
						VAN CODE
					</label>
					<input
						className="input-text"
						id="van-id"
						type="text"
						ref={vanCodeInputRef}
						required
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="input-label" htmlFor="van-id">
						VAN ID
					</label>
					<input
						className="input-text"
						id="van-id"
						type="text"
						ref={vanIdInputRef}
					/>
				</div>

				<div className="col-span-4">
					<div className="input-label">??????</div>
					<div className="flex justify-between">
						<CheckboxButton
							id="pos"
							onChangeFunction={setProduct}
							title="??????"
						/>
						<CheckboxButton
							id="kiosk"
							onChangeFunction={setProduct}
							title="????????????"
						/>
						<CheckboxButton
							id="printer"
							onChangeFunction={setProduct}
							title="???????????????"
						/>
						<CheckboxButton
							id="cat"
							onChangeFunction={setProduct}
							title="?????????"
						/>
						<CheckboxButton
							id="router"
							onChangeFunction={setProduct}
							title="?????????"
						/>
					</div>
				</div>

				<div className="col-span-4">
					<label className="input-label" htmlFor="note">
						??????
					</label>
					<textarea
						className="input-textarea"
						id="note"
						maxLength={500}
						rows={3}
						ref={noteInputRef}
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

export default StoreRegisterForm
