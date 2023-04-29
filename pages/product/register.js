
import { useForm } from "react-hook-form"
import PageTitle from "../../components/ui/page-title"
import { useAddProductMutation } from "../../query/productApi"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { Dropdown } from "../../components/ui/dropdown"
import { categoryItems, vanItems } from "../../lib/variables/variables"
import { toast } from "react-toastify"

const ProductRegisterPage = () => {

	const { register, reset, control, handleSubmit } = useForm({
		mode: "onSubmit",
		defaultValues: {
			name: "",
			van: "",
			category: "",
			productCompany: "",
			brand: "",
		},
	})

	const [addProduct] = useAddProductMutation()
	const { data: companyData } = useGetAllItemsByUrlQuery({
		url: "company",
	})
	const { data: brandData } = useGetAllItemsByUrlQuery({
		url: "brand",
	})
	const companyList = editItemforDropdownButton(companyData?.company)
	const brandList = editItemforDropdownButton(brandData?.brand)

	const submitHandler = async (formData) => {
		if (
			formData.name === "" ||
			formData.van === "" ||
			formData.category === "" ||
			formData.productCompany === "" ||
			formData.brand === ""
		) {
			alert("옵션을 모두 선택 해주세요.")
			return
		}
		const accept = confirm("장비를 등록 하시겠습니까?")
		if (!accept) {
			return
		}
		const body = {
			...formData,
		}
		const { data } = await addProduct(body)
		if (data.success) {
			toast.success(data.message)
			reset()
			return
		} else {
			toast.error(data.message)
		}
	}
	return (
		<>
			<PageTitle title="장비 등록" />
			<section className="container lg:w-2/5">
				<form
					className="grid grid-cols-4 gap-4"
					onSubmit={handleSubmit(submitHandler)}
				>
					<div className="col-span-4">
						<label className="input-label">모델명</label>
						<input className="input-text" {...register("name")} />
					</div>
					<div className="col-span-2">
						<Dropdown
							control={control}
							options={vanItems}
							placeholder="VAN"
							name="van"
							required={true}
						/>
					</div>
					<div className="col-span-2">
						<Dropdown
							control={control}
							options={categoryItems}
							placeholder="카테고리"
							name="category"
						/>
					</div>
					<div className="col-span-2">
						<Dropdown
							control={control}
							options={companyList}
							placeholder="제조사"
							name="productCompany"
						/>
					</div>
					<div className="col-span-2">
						<Dropdown
							control={control}
							options={brandList}
							placeholder="법인명"
							name="brand"
						/>
					</div>

					<div className="col-span-4">
						<button className="input-button" type="submit">
							등록
						</button>
					</div>
				</form>
			</section>
		</>
	)

}

export default ProductRegisterPage
