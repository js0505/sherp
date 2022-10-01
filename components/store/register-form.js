import { format } from "date-fns"
import { useRef, useState } from "react"
import DatalistInput, { useComboboxControls } from "react-datalist-input"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import DropDownButton from "../ui/dropdown-button"

const vanItems = [
	{ name: "KIS", _id: "KIS" },
	{ name: "NICE", _id: "NICE" },
	{ name: "FDIK", _id: "FDIK" },
	{ name: "DAOU", _id: "DAOU" },
	{ name: "SMARTRO", _id: "SMARTRO" },
	{ name: "JTNET", _id: "JTNET" },
	{ name: "KSNET", _id: "KSNET" },
	{ name: "KFTC", _id: "KFTC" },
	{ name: "KICC", _id: "KICC" },
]
const isBackupItems = [
	{ name: "메인", _id: false },
	{ name: "백업", _id: true },
]

const cityItems = [
	{ name: "시흥시", _id: "시흥시" },
	{ name: "인천시", _id: "인천시" },
	{ name: "서울시", _id: "서울시" },
	{ name: "고양시", _id: "고양시" },
	{ name: "파주시", _id: "파주시" },
	{ name: "안산시", _id: "안산시" },
]

function StoreRegisterForm(props) {
	const { filteredProducts, users } = props
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const [selectedProducts, setSelectedProducts] = useState([])
	const [isBackup, setIsBackup] = useState(isBackupItems[0]._id)
	const [selectedVANName, setSelectedVANName] = useState(vanItems[0]._id)
	const [selectedCity, setSelectedCity] = useState(cityItems[0]._id)
	const [selectedUser, setSelectedUser] = useState(users[0]._id)
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

	const { setValue: setDataListValue, value: dataListValue } =
		useComboboxControls({
			initialValue: "",
		})
	function selectedVANNameHandler(name) {
		setSelectedVANName(name)
	}
	function selectedIsBackupHandler(name) {
		setIsBackup(name)
	}
	function selectedUserHandler(name) {
		setSelectedUser(name)
	}
	function selectedCityHandler(name) {
		setSelectedCity(name)
	}
	function dataListSelectHandler(item) {
		if (selectedProducts.length > 3) {
			alert("최대 4개까지 입력 가능 합니다.")
			return
		}
		setSelectedProducts([...selectedProducts, item])
		setDataListValue("")
	}

	function removeToListFunction(item) {
		setSelectedProducts(
			selectedProducts.filter((product) => product.id !== item.id),
		)
	}

	async function submitHandler(e) {
		e.preventDefault()
		const body = {
			user: selectedUser,
			storeName: storeNameInputRef.current.value,
			businessNum: businessNumInputRef.current.value,
			van: selectedVANName,
			vanId: vanIdInputRef.current.value,
			vanCode: vanCodeInputRef.current.value,
			owner: ownerInputRef.current.value,
			city: selectedCity,
			address: addressInputRef.current.value,
			contact: contactInputRef.current.value,
			product: selectedProducts.map((item) => ({
				productId: item.id,
			})),
			cms: cmsInputRef.current.value,
			contractDate: contractDate,
			note: noteInputRef.current.value,
			isBackup: isBackup,
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

		setSelectedProducts([])
		setIsBackup(isBackupItems[0]._id)
		setSelectedVANName(vanItems[0]._id)
		setSelectedCity(() => cityItems[0]._id)
		setSelectedUser(users[0]._id)
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
		<section className="container lg:w-3/5 ">
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
					<DropDownButton
						items={users}
						label="담당자"
						handler={selectedUserHandler}
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
						required
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
					<DropDownButton
						items={cityItems}
						label="주소(도시)"
						handler={selectedCityHandler}
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
					<DropDownButton
						items={isBackupItems}
						label="메인/백업"
						handler={selectedIsBackupHandler}
					/>
				</div>

				<div className="col-span-1">
					<DropDownButton
						items={vanItems}
						label="VAN"
						handler={selectedVANNameHandler}
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
				<div className="col-span-1">
					<label className="input-label" htmlFor="van-id">
						VAN CODE
					</label>
					<input
						className="input-text"
						id="van-id"
						type="text"
						ref={vanCodeInputRef}
					/>
				</div>
				<div className="col-span-3">
					<div className="input-label">선택한 제품</div>
					<div className="input-text flex py-1 overflow-auto ">
						{selectedProducts &&
							selectedProducts.map((item, index) => (
								<div
									className="flex border w-30 py-1 px-2 rounded-md mr-2 bg-primary"
									key={index}
								>
									<div className="mr-2 text-white">{item.value}</div>
									<div
										className="text-white cursor-pointer"
										onClick={() => removeToListFunction(item)}
									>
										X
									</div>
								</div>
							))}
					</div>
				</div>
				<div className="col-span-1 ">
					<DatalistInput
						value={dataListValue}
						setValue={setDataListValue}
						className="relative"
						label={<div className="input-label">제품선택</div>}
						onSelect={(item) => dataListSelectHandler(item)}
						items={filteredProducts}
						required
						inputProps={{ className: " input-text " }}
						listboxOptionProps={{
							className:
								" px-2 py-2 h-10 hover:bg-primary hover:text-white  w-full",
						}}
						isExpandedClassName="absolute border border-gray-300 rounded-md   bg-white w-full max-h-40 overflow-auto "
					/>
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
