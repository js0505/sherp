import { useCallback, useEffect, useState } from "react"
import { cityItems, isBackupItems } from "../../lib/variables/variables"
import DatalistInput, { useComboboxControls } from "react-datalist-input"
import { vanItems } from "../../lib/variables/variables"

import Dropdown from "react-dropdown"
import { DownArrow } from "../ui/icons/arrows"

function StoreItemDetail(props) {
	const { item, modalHandler, filteredProducts } = props

	const [isEditable, setIsEditable] = useState(false)
	const [contractDate, setContractDate] = useState("")
	const [storeName, setStoreName] = useState("")
	const [businessNum, setBusinessNum] = useState(0)
	const [city, setCity] = useState("")
	const [address, setAddress] = useState("")
	const [isBackup, setIsBackup] = useState(false)
	const [contact, setContact] = useState("")
	const [user, setUser] = useState("")
	const [van, setVan] = useState("")
	const [vanId, setVanId] = useState("")
	const [vanCode, setVanCode] = useState("")
	const [cms, setCms] = useState("")
	const [selectedProducts, setSelectedProducts] = useState([])
	const [owner, setOwner] = useState("")

	const { setValue: setDataListValue, value: dataListValue } =
		useComboboxControls({
			initialValue: "",
		})

	const initProducts = useCallback(() => {
		let initProductList = []

		item.product.map((alreadyHavedItem) => {
			const filtered = filteredProducts.find(
				(filteredItem) => filteredItem.id === alreadyHavedItem.productId._id,
			)
			initProductList.push(filtered)
		})

		return initProductList
	}, [filteredProducts, item.product])

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

	useEffect(() => {
		setVan(item.van)
		setCity(item.city)
		setIsBackup(item.isBackup ? "백업" : "메인")
		setUser(item.user.name)

		setContractDate(item.contractDate)
		setStoreName(item.storeName)
		setBusinessNum(filteredBusinessNum(item.businessNum))
		setAddress(item.address)
		setContact(item.contact)
		setVanId(item.vanId)
		setVanCode(item.vanCode)
		setCms(item.cms)
		setSelectedProducts(initProducts)
		setOwner(item.owner)

		if (isEditable) {
			// 수정모드 들어갈 때 사업자번호 안에 - 값 제거
			setBusinessNum(businessNum.replace(/-/g, ""))
		}
	}, [item, isEditable, businessNum, filteredBusinessNum, initProducts])

	function cancelSubmitHandler() {
		const accept = confirm("수정을 취소 하시겠습니까?")

		if (!accept) {
			return
		} else {
			setIsEditable(!isEditable)
		}
	}

	function editStoreSubmitHandler(e) {
		e.preventDefault()
		alert("submit form")

		// todo : 사업자번호 10자리 값 확인.

		setIsEditable(!isEditable)
	}
	function removeToListFunction(item) {
		setSelectedProducts(
			selectedProducts.filter((product) => product.id !== item.id),
		)
	}
	function dataListSelectHandler(item) {
		if (selectedProducts.length > 3) {
			alert("최대 4개까지 입력 가능 합니다.")
			return
		}
		setSelectedProducts([...selectedProducts, item])
		setDataListValue("")
	}
	return (
		<>
			{item && (
				<div className="flex justify-between divide-x divide-gray-300  w-[80rem] p-3">
					<div className="w-full p-3 grid grid-cols-5 gap-4">
						<div className="col-span-2">
							<label className="input-label " htmlFor="contract-date">
								계약일자
							</label>
							<input
								className="input-text"
								id="contract-date"
								type="date"
								value={contractDate}
								// onChange={(event) => setContractDate(event.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-1">
							<label className="input-label">담당자</label>
							<input
								className="input-text"
								value={user}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-1">
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
						<div className="col-span-1">
							<label className="input-label">메인/백업</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={isBackupItems}
								disabled={!isEditable}
								value={isBackup}
								onChange={setIsBackup}
							/>
						</div>
						<div className="col-span-3">
							<label className="input-label">상호명</label>
							<input
								className="input-text"
								value={storeName}
								onChange={(e) => setStoreName(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">사업자번호</label>
							<input
								className="input-text"
								value={businessNum}
								maxLength={10}
								onChange={(e) => setBusinessNum(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-1">
							<label className="input-label">도시</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={cityItems}
								value={city}
								onChange={setCity}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-4">
							<label className="input-label">주소</label>
							<input
								className="input-text"
								value={address}
								required
								disabled={!isEditable}
							/>
						</div>

						<div className="col-span-2">
							<label className="input-label">대표자명</label>
							<input
								className="input-text"
								value={owner}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">연락처</label>
							<input
								className="input-text"
								value={contact}
								required
								disabled={!isEditable}
							/>
						</div>
						<div>
							<label className="input-label">CMS</label>
							<input
								className="input-text"
								value={cms}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5">
							<div className="input-label">선택한 제품</div>
							<div className="input-text flex py-1 overflow-auto ">
								{selectedProducts &&
									selectedProducts.map((item, index) => (
										<div
											className="flex w-30 p-2  rounded-md mr-2 bg-primary"
											key={index}
										>
											<div className="mr-2 text-white">{item.value}</div>
											<div
												className={`${
													isEditable
														? "text-white cursor-pointer block"
														: "hidden"
												}`}
												onClick={() => removeToListFunction(item)}
											>
												X
											</div>
										</div>
									))}
							</div>
						</div>
						<div className={`${isEditable ? "col-span-5 block" : "hidden"}`}>
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
								isExpandedClassName="absolute border border-gray-300 rounded-md   
											bg-white w-full max-h-40 overflow-auto "
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">VAN Code</label>
							<input
								className="input-text"
								value={vanCode}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">VAN ID</label>
							<input
								className="input-text"
								value={vanId}
								disabled={!isEditable}
							/>
						</div>
					</div>
					<div className="w-full  p-3 grid grid-cols-5 gap-3">
						<div className="col-span-5">
							<label className="input-label">비고</label>
							<textarea
								rows={6}
								disabled={!isEditable}
								className="input-textarea"
							></textarea>
						</div>
						<div className="col-span-5">
							<div>
								<label className="input-label">수리내역</label>
								<input className="input-text" />
							</div>
						</div>
						<div className="col-span-5 flex">
							<div className="w-full mr-1">
								<button
									className={`input-button w-full `}
									onClick={
										isEditable
											? (e) => editStoreSubmitHandler(e)
											: () => setIsEditable(!isEditable)
									}
								>
									{isEditable ? "수정완료" : "정보수정"}
								</button>
							</div>
							<div className="w-full ml-1">
								<button
									className={`input-button w-full ${
										isEditable ? "hidden" : "block"
									}`}
									onClick={modalHandler}
								>
									확인
								</button>
								<button
									className={`input-button w-full ${
										isEditable ? "block" : "hidden"
									}`}
									onClick={cancelSubmitHandler}
								>
									취소
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default StoreItemDetail
