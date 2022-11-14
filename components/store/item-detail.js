import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { cityItems, isBackupItems } from "../../lib/variables/variables"
import { CheckboxButton } from "../ui/checkbox-button"
import { vanItems } from "../../lib/variables/variables"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import Dropdown from "react-dropdown"
import { DownArrow } from "../ui/icons/arrows"
import { format } from "date-fns"
import { getAllUsers } from "../../lib/util/user-util"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"

function StoreItemDetail(props) {
	const {
		item,
		setItem,
		modalHandler,
		filteredProducts,
		updateRowDataFunction,
	} = props
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")
	const { data: session } = useSession()

	const [isEditable, setIsEditable] = useState(false)
	const [contractDate, setContractDate] = useState("")
	const [storeName, setStoreName] = useState("")
	const [businessNum, setBusinessNum] = useState(0)
	const [city, setCity] = useState("")
	const [address, setAddress] = useState("")
	const [isBackup, setIsBackup] = useState(false)
	const [contact, setContact] = useState("")
	const [user, setUser] = useState("")
	const [users, setUsers] = useState([])
	const [van, setVan] = useState("")
	const [vanId, setVanId] = useState("")
	const [vanCode, setVanCode] = useState("")
	const [closeDate, setCloseDate] = useState("")
	const [cms, setCms] = useState("")
	const [product, setProduct] = useState({})
	const [owner, setOwner] = useState("")
	const [note, setNote] = useState("")
	const [asNote, setAsNote] = useState([])
	const [asNoteDate, setAsNoteDate] = useState("")
	const [asNoteValue, setAsNoteValue] = useState("")

	useEffect(() => {
		setVan(item.van)
		setCity(item.city)
		setIsBackup(item.isBackup ? "백업" : "메인")
		setUser({ label: item.user.name, value: item.user._id })
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
		setCloseDate(() =>
			item.closeDate === undefined ? "영업중" : item.closeDate,
		)
		setAsNoteDate(formattedToday)

		const getUsers = async () => {
			const users = await getAllUsers()
			const editedUsers = editItemforDropdownButton(users)

			setUsers(editedUsers)
		}
		getUsers()

		if (isEditable) {
			// 수정모드 들어갈 때 사업자번호 안에 - 값 제거
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

	const cancelSubmitHandler = () => {
		const accept = confirm("수정을 취소 하시겠습니까?")

		if (!accept) {
			return
		} else {
			setIsEditable(!isEditable)
		}
	}

	const editStoreSubmitHandler = async (e) => {
		e.preventDefault()

		// todo : 사업자번호 10자리 값 확인.
		if (businessNum.length != 10) {
			alert("사업자번호는 10자리 입니다.")
			return
		}

		const accept = confirm("정보를 수정 하시겠습니까?")

		if (!accept) {
			return
		} else {
			const body = {
				_id: item._id,
				user: user.value,
				storeName,
				contractDate,
				businessNum,
				city: city.value,
				address,
				contact,
				van: van.value,
				vanId,
				vanCode,
				closeDate,
				cms,
				product,
				owner,
				note,
			}

			const response = await fetchHelperFunction("PATCH", "/api/store", body)
			if (response.success) {
				alert(response.message)
				// 기존 표에 새로운 데이터 업데이트
				updateRowDataFunction(response.updatedStore)
				setItem(response.updatedStore)
				setIsEditable(!isEditable)
			} else {
				alert(response.message)
			}
		}
	}

	const asNoteSubmitHandler = async (e) => {
		const accept = confirm("수리내역을 저장 하시겠습니까?")
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
			const response = await fetchHelperFunction("POST", "/api/store/as", body)
			if (response.success) {
				alert(response.message)

				// 밑에는 다시 데이터를 불러오지 않고 수리내역이 보이게끔 하려고 만듬.
				setAsNote([...asNote, body])
				setAsNoteValue("")
				item.asNote.push(body)
			} else {
				alert(response.message)
			}
		}
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
								onChange={(event) => setContractDate(event.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-1">
							<label className="input-label">담당자</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={users}
								disabled={!isEditable}
								value={user}
								onChange={setUser}
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
								onChange={(e) => setAddress(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>

						<div className="col-span-2">
							<label className="input-label">대표자명</label>
							<input
								className="input-text"
								value={owner}
								onChange={(e) => setOwner(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">연락처</label>
							<input
								className="input-text"
								value={contact}
								onChange={(e) => setContact(e.target.value)}
								required
								disabled={!isEditable}
							/>
						</div>
						<div>
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
							<div className="input-label">장비</div>
							<div className="flex">
								<CheckboxButton
									id="pos"
									disabled={!isEditable}
									value={product}
									onChangeFunction={setProduct}
									title="포스"
								/>
								<CheckboxButton
									id="kiosk"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="키오스크"
								/>
								<CheckboxButton
									id="printer"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="주방프린터"
								/>
								<CheckboxButton
									id="cat"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="단말기"
								/>
								<CheckboxButton
									id="router"
									value={product}
									disabled={!isEditable}
									onChangeFunction={setProduct}
									title="라우터"
								/>
							</div>
						</div>

						<div className="col-span-1">
							<label className="input-label">영업중/폐업</label>
							<input
								className="input-text"
								value={closeDate}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">VAN Code</label>
							<input
								className="input-text"
								value={vanCode}
								onChange={(e) => setVanCode(e.target.value)}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2">
							<label className="input-label">VAN ID</label>
							<input
								className="input-text"
								value={vanId}
								onChange={(e) => setVanId(e.target.value)}
								disabled={!isEditable}
							/>
						</div>
					</div>
					<div className="w-full  p-3 grid grid-cols-5 gap-3">
						<div className="col-span-5">
							<label className="input-label">비고</label>
							<textarea
								rows={6}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								disabled={!isEditable}
								className="input-textarea"
							></textarea>
						</div>
						<div className="col-span-5">
							<div>
								<label className="input-label">수리내역</label>

								<div className="mt-3 mb-3 border border-gray-300 rounded-md p-2 overflow-auto  max-h-60">
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
								<div>
									<form className="flex" onSubmit={asNoteSubmitHandler}>
										{/* 수리내역 완성하기 */}
										<input
											className="input-text h-9 w-1/3 mr-2"
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
