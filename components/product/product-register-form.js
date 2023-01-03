import { useRef, useState } from "react"
import Dropdown from "react-dropdown"
import { categoryItems, vanItems } from "../../lib/variables/variables"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { DownArrow } from "../ui/icons/arrows"
import { api } from "../../query/api"

function ProductRegisterForm() {
	const [selectedVANName, setSelectedVANName] = useState()
	const [selectedCategoryName, setSelectedCategoryName] = useState()
	const [selectedCompanyId, setSelectedCompanyId] = useState()
	const [selectedBrandId, setSelectedBrandId] = useState()

	const productNameInputRef = useRef()

	const [addProduct] = api.useAddProductMutation()
	const { data: companyData } = api.useGetAllItemsByUrlQuery({
		url: "company",
	})
	const { data: brandData } = api.useGetAllItemsByUrlQuery({
		url: "brand",
	})
	const companyList = editItemforDropdownButton(companyData?.company)
	const brandList = editItemforDropdownButton(brandData?.brand)

	const submitHandler = async (e) => {
		e.preventDefault()
		const productName = productNameInputRef.current.value

		if (productName === "") {
			alert("모델명을 입력 해주세요.")
			return
		}

		if (
			selectedBrandId === undefined ||
			selectedCategoryName === undefined ||
			selectedCompanyId === undefined ||
			selectedVANName === undefined
		) {
			alert("옵션을 모두 선택 해주세요.")
			return
		}

		const accept = confirm("장비를 등록 하시겠습니까?")

		if (!accept) {
			return
		}
		const body = {
			name: productName,
			van: selectedVANName.value,
			category: selectedCategoryName.value,
			brand: selectedBrandId.value,
			productCompany: selectedCompanyId.value,
		}

		const { data } = await addProduct(body)

		if (data.success) {
			alert(data.message)

			productNameInputRef.current.value = ""
			setSelectedBrandId(undefined)
			setSelectedCategoryName(undefined)
			setSelectedCompanyId(undefined)
			setSelectedVANName(undefined)
			return
		} else {
			alert(data.message)
		}
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
						placeholder="VAN"
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={categoryItems}
						placeholder="카테고리"
						value={selectedCategoryName}
						onChange={setSelectedCategoryName}
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={companyList}
						placeholder="제조사"
						value={selectedCompanyId}
						onChange={setSelectedCompanyId}
					/>
				</div>
				<div className="col-span-2">
					<Dropdown
						arrowClosed={<DownArrow />}
						arrowOpen={<DownArrow />}
						options={brandList}
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

export default ProductRegisterForm
