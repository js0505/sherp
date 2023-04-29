import PageTitle from "../../components/ui/page-title"
import dynamic from "next/dynamic"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import { useLazyGetFilteredProductQuery } from "../../query/productApi"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { useForm } from "react-hook-form"
import { Dropdown } from "../../components/ui/dropdown"
import { vanItems, categoryItems } from "../../lib/variables/variables"

const DynamicGridTable = dynamic(import("../../components/ui/grid-table"))

const ProductListPage = () => {
	const [trigger, result] = useLazyGetFilteredProductQuery()
	const { data: brands } = useGetAllItemsByUrlQuery({ url: "brand" })
	const dropdownBrands = editItemforDropdownButton(brands?.brand)

	const { control, handleSubmit, register, reset } = useForm({
		mode: "onSubmit",
		defaultValues: {
			van: "",
			category: "",
			brand: "",
		},
	})

	const columns = [
		{
			headerName: "제품명",
			field: "name",
			minWidth: 180,
		},
		{
			headerName: "카테고리",
			field: "category",
			maxWidth: 150,
			minWidth: 100,
		},
		{
			headerName: "재고수량",
			field: "qty",
			floatingFilter: false,
			filter: false,
			maxWidth: 100,
			minWidth: 100,
			valueGetter: (params) => {
				return `${params.data.qty}대`
			},
		},
		{
			headerName: "법인명",
			field: "brand.name",
			minWidth: 100,
		},

		{ headerName: "VAN", field: "van", minWidth: 100 },
	]

	const onGridReady = (params) => {
		params.columnApi.autoSizeColumns(["qty", "name"], true)
		params.api.sizeColumnsToFit()
	}

	const submitHandler = async (formData) => {
		await trigger({
			...formData,
		})
	}

	return (
		<>
			<PageTitle title="장비 리스트" />
			<div>
				<form
					className="flex justify-center"
					onSubmit={handleSubmit(submitHandler)}
				>
					<div className=" lg:w-1/2 grid  grid-cols-6 gap-3">
						<div className="col-span-2">
							<Dropdown
								control={control}
								options={vanItems}
								placeholder="VAN"
								name="van"
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
								options={dropdownBrands}
								placeholder="법인명"
								name="brand"
							/>
						</div>

						<input
							className="input-text  col-span-3 w-full text-lg"
							placeholder="제품명"
							{...register("name")}
						/>
						<div className="col-span-3">
							<div className="flex">
								<button
									className="input-button mr-3 mt-1 lg:w-full "
									type="submit"
								>
									검색
								</button>
								<button
									className="input-button mt-1 lg:w-full "
									type="button"
									onClick={() => reset()}
								>
									초기화
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
			{result.data && (
				<div className="lg:w-5/6 lg:container">
					<DynamicGridTable
						columnDefs={columns}
						rowData={result.data.products}
						onGridReady={onGridReady}
						filter={true}
						floatingFilter={true}
					/>
				</div>
			)}
		</>
	)
}

export default ProductListPage
