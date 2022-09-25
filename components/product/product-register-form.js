import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import DropDownButton from "../ui/dropdown-button"

const categoryItems = [
	{ name: "프린터", _id: "프린터" },
	{ name: "리더기", _id: "리더기" },
	{ name: "포스", _id: "포스" },
	{ name: "키오스크", _id: "키오스크" },
	{ name: "CAT단말기", _id: "CAT단말기" },
	{ name: "서명패드", _id: "서명패드" },
	{ name: "멀티패드", _id: "멀티패드" },
	{ name: "부가장비", _id: "부가장비" },
]

const vanItems = [
	{ name: "없음", _id: "없음" },
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
function ProductRegisterForm(props) {
	const [productCompany, setProductCompany] = useState()
	const [brand, setBrand] = useState()
	const [selectedVANName, setSelectedVANName] = useState()
	const [selectedname, setSelectedname] = useState()
	const [selectedCompanyId, setSelectedCompanyId] = useState()
	const [selectedBrandId, setSelectedBrandId] = useState()

	const productNameInputRef = useRef()

	const router = useRouter()

	async function init() {
		const { company } = await fetchHelperFunction("GET", "/api/company")
		const { brand } = await fetchHelperFunction("GET", "/api/brand")
		setProductCompany(company)
		setBrand(brand)
		setSelectedCompanyId(company[0]._id)
		setSelectedBrandId(brand[0]._id)
		setSelectedVANName(vanItems[0].name)
		setSelectedname(categoryItems[0].name)
	}

	useEffect(() => {
		init()
	}, [])

	function selectedVANNameHandler(name) {
		setSelectedVANName(name)
	}
	function selectednameHandler(name) {
		setSelectedname(name)
	}
	function selectedCompanyIdHandler(id) {
		setSelectedCompanyId(id)
	}
	function selectedBrandIdHandler(id) {
		setSelectedBrandId(id)
	}

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
				van: selectedVANName,
				category: selectedname,
				brand: selectedBrandId,
				productCompany: selectedCompanyId,
			}
		} else {
			return
		}

		const result = await props.addProduct(body)

		alert(result.message)
		router.reload()
	}

	return (
		<section className="container lg:w-3/5">
			<form className="grid grid-cols-4 gap-4" onSubmit={submitHandler}>
				<div className="col-span-4">
					<label className="input-label">모델명</label>
					<input className="input-text" ref={productNameInputRef} />
				</div>
				<div className="col-span-2">
					<DropDownButton
						items={vanItems}
						label="VAN"
						handler={selectedVANNameHandler}
					/>
				</div>
				<div className="col-span-2">
					<DropDownButton
						items={categoryItems}
						label="유형"
						handler={selectednameHandler}
					/>
				</div>
				<div className="col-span-2">
					<DropDownButton
						items={productCompany}
						label="제조사"
						handler={selectedCompanyIdHandler}
					/>
				</div>
				<div className="col-span-2">
					<DropDownButton
						items={brand}
						label="법인명"
						handler={selectedBrandIdHandler}
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
