import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
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
function StoreRegisterForm({ users }) {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const [product, setProduct] = useState(storeProductsInit)
	const [isBackup, setIsBackup] = useState()
	const [selectedVANName, setSelectedVANName] = useState()
	const [selectedCity, setSelectedCity] = useState()
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

	const editedUsers = editItemforDropdownButton(users)

	useEffect(() => {
		setIsBackup(isBackupItems[0])
		setSelectedVANName(vanItems[0])
		setSelectedCity(cityItems[0])
		setSelectedUser(editedUsers[0])
	}, [])

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

		const accept = confirm("가맹점을 등록 하시겠습니까?")

		if (!accept) {
			return
		}

		const response = await fetchHelperFunction("POST", "/api/store", body)

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
		<section className="container w-2/5 ">
			<form onSubmit={submitHandler} className="grid grid-cols-4 gap-4">
				<div className="col-span-1">
					<label className="input-label" htmlFor="contract-date">
						계약일자
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
				<div className="col-span-2">
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
				<div className="col-span-1">
					<label className="input-label" htmlFor="business-number">
						사업자번호
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
				<div className="col-span-1">
					<label className="input-label" htmlFor="owner">
						대표자명
					</label>
					<input
						className="input-text"
						id="owner"
						type="text"
						ref={ownerInputRef}
						required
					/>
				</div>
				<div className="col-span-1">
					<label className="input-label" htmlFor="user">
						담당자
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={editedUsers}
						value={selectedUser}
						onChange={setSelectedUser}
					/>
				</div>
				<div className="col-span-1">
					<label className="input-label" htmlFor="contact">
						연락처
					</label>
					<input
						className="input-text"
						id="contact"
						type="text"
						ref={contactInputRef}
					/>
				</div>
				<div className="col-span-1">
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

				<div className="col-span-1">
					<label className="input-label" htmlFor="city">
						주소(도시)
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={cityItems}
						value={selectedCity}
						onChange={setSelectedCity}
					/>
				</div>
				<div className="col-span-3">
					<label className="input-label" htmlFor="address">
						주소
					</label>
					<input
						className="input-text"
						id="address"
						type="text"
						ref={addressInputRef}
						required
					/>
				</div>

				<div className="col-span-1">
					<label className="input-label" htmlFor="isbackup">
						메인/백업
					</label>
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={isBackupItems}
						value={isBackup}
						onChange={setIsBackup}
					/>
				</div>

				<div className="col-span-1">
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
				<div className="col-span-1">
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
				<div className="col-span-1">
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
					<div className="input-label">장비</div>
					<div className="flex justify-between">
						<CheckboxButton
							id="pos"
							onChangeFunction={setProduct}
							title="포스"
						/>
						<CheckboxButton
							id="kiosk"
							onChangeFunction={setProduct}
							title="키오스크"
						/>
						<CheckboxButton
							id="printer"
							onChangeFunction={setProduct}
							title="주방프린터"
						/>
						<CheckboxButton
							id="cat"
							onChangeFunction={setProduct}
							title="단말기"
						/>
						<CheckboxButton
							id="router"
							onChangeFunction={setProduct}
							title="라우터"
						/>
					</div>
				</div>

				<div className="col-span-4">
					<label className="input-label" htmlFor="note">
						비고
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
						등록
					</button>
				</div>
			</form>
		</section>
	)
}

export default StoreRegisterForm
