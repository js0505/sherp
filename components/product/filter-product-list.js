import { useRef, useState } from "react"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import {
	useGetAllItemsByUrlQuery,
	useLazyGetFilteredProductQuery,
} from "../../query/api"
import GridTable from "../ui/grid-table"
import { DownArrow } from "../ui/icons/arrows"
import Dropdown from "react-dropdown"
import { categoryItems, vanItems } from "../../lib/variables/variables"

// 제품 검색 필터
//  제품명 : 문자
//  van, 카테고리, 법인 : 드롭다운

const FilterProductList = () => {
	const [trigger, result] = useLazyGetFilteredProductQuery()
	const { data: brands } = useGetAllItemsByUrlQuery({ url: "brand" })
	const dropdownBrands = editItemforDropdownButton(brands?.brand)

	const productNameInputRef = useRef()
	const [van, setVan] = useState("")
	const [category, setCategory] = useState("")
	const [brand, setBrand] = useState("")

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

	const submitHandler = async (e) => {
		e.preventDefault()

		const name = productNameInputRef.current.value

		await trigger({
			name,
			van: van.value ? van.value : "",
			brand: brand.value ? brand.value : "",
			category: category.label ? category.label : "",
		})
	}

	return (
		<>
			<div className="">
				<form className="flex justify-center" onSubmit={submitHandler}>
					<div className=" lg:w-1/2 grid  grid-cols-6 gap-3">
						<Dropdown
							className=" col-span-2"
							placeholder="VAN"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={vanItems}
							onChange={setVan}
							value={van}
						/>
						<Dropdown
							className=" col-span-2"
							placeholder="카테고리"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={categoryItems}
							onChange={setCategory}
							value={category}
						/>
						<Dropdown
							className=" col-span-2"
							placeholder="법인명"
							arrowClosed={<DownArrow />}
							arrowOpen={<DownArrow />}
							options={dropdownBrands}
							onChange={setBrand}
							value={brand}
						/>
						<input
							className="input-text  col-span-3 w-full text-lg"
							ref={productNameInputRef}
							placeholder="제품명"
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
									onClick={() => {
										productNameInputRef.current.value = ""
										setVan("")
										setCategory("")
										setBrand("")
									}}
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
					<GridTable
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

export default FilterProductList
