import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import { categoryItems, vanItems } from "../../lib/variables/variables"
import Dropdown from "react-dropdown"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { DownArrow } from "../ui/icons/arrows"
function ProductRegisterForm(props) {
	const [productCompany, setProductCompany] = useState()
	const [brand, setBrand] = useState()
	const [selectedVANName, setSelectedVANName] = useState()
	const [selectedCategoryName, setSelectedCategoryName] = useState()
	const [selectedCompanyId, setSelectedCompanyId] = useState()
	const [selectedBrandId, setSelectedBrandId] = useState()

	const productNameInputRef = useRef()

	const router = useRouter()

	async function init() {
		const { company } = await fetchHelperFunction("GET", "/api/company")
		const { brand } = await fetchHelperFunction("GET", "/api/brand")

		const editedCompany = editItemforDropdownButton(company)
		const editedBrand = editItemforDropdownButton(brand)

		setProductCompany(editedCompany)
		setBrand(editedBrand)
		setSelectedCompanyId(editedCompany[0])
		setSelectedBrandId(editedBrand[0])
		setSelectedVANName(vanItems[0])
		setSelectedCategoryName(categoryItems[0])
	}

	useEffect(() => {
		init()
	}, [])

	async function submitHandler(e) {
		e.preventDefault()
		const productName = productNameInputRef.current.value

		if (productName === "") {
			alert("모델명을 입력 해주세요.")
			return
		}

		const accept = confirm("장비를 등록 하시겠습니까?")

		let body

		if (accept) {
			body = {
				name: productName,
				van: selectedVANName.value,
				category: selectedCategoryName.value,
				brand: selectedBrandId.value,
				productCompany: selectedCompanyId.value,
			}
		} else {
			return
		}

		const result = await props.addProduct(body)

		alert(result.message)

		router.reload()
	}

	return (
		<section className="container lg:w-2/5">
			<form className="grid grid-cols-4 gap-4" onSubmit={submitHandler}>
				<div className="col-span-4">
					<label className="input-label">모델명</label>
					<input className="input-text" ref={productNameInputRef} />
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={vanItems}
						onChange={setSelectedVANName}
						value={selectedVANName}
						placeholder="Select an option"
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={categoryItems}
						placeholder="유형"
						value={selectedCategoryName}
						onChange={setSelectedCategoryName}
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={productCompany}
						placeholder="제조사"
						value={selectedCompanyId}
						onChange={setProductCompany}
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={brand}
						value={selectedBrandId}
						placeholder="법인명"
						onChange={setSelectedBrandId}
					/>
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

// - 제조사 (_id) (기존 데이터 불러오기)
// - 모델명
// - VAN
// - 유형 : 프린터, 리더기, 포스, 키오스크, 부가장비 …
// - 보유 수량 (기본 1)
// - 법인명 (_id) (기존 데이터 불러오기)
export default ProductRegisterForm
