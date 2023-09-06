import { getBrands } from "@/actions/getBrands"
import { getProductCompanies } from "@/actions/getProductCompanies"
import Button from "@/components/Button"
import Container from "@/components/Container"
import Heading from "@/components/Heading"
import Input from "@/components/inputs/Input"
import ListboxButton from "@/components/Listbox"
import useDate from "@/hooks/useDate"
import { categoryItems, vanItems } from "@/lib/variables/variables"
import { useAddBrandMutation } from "@/query/brandApi"
import { useAddProductMutation } from "@/query/productApi"
import { useAddProductCompanyMutation } from "@/query/productCompanyApi"
import axios from "axios"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { saveAs } from "file-saver"
import { getSession } from "next-auth/react"

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })

	if (!session) {
		return {
			redirect: {
				destination: "/auth",
				permanent: false,
			},
		}
	}
	const brands = await getBrands()
	const productCompanies = await getProductCompanies()

	return {
		props: { brands, productCompanies },
	}
}

function Admin({ brands, productCompanies }) {
	const {
		register,
		control,
		reset,
		getValues,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			productName: "",
			productVan: "",
			productCategory: "",
			productProductCompany: "",
			productBrand: "",
			productCompanyName: "",
			productCompanyContact: "",
			productCompanyAddress: "",
			brandName: "",
		},
	})

	const [addProduct] = useAddProductMutation()
	const [addProductCompany] = useAddProductCompanyMutation()
	const [addBrand] = useAddBrandMutation()

	const onSubmitHandler = async (buttonLabel: string) => {
		const accept = confirm(`${buttonLabel} 하시겠습니까?`)

		if (!accept) {
			return
		}

		const {
			productName,
			productVan,
			productCategory,
			productBrand,
			productProductCompany,
			productCompanyName,
			productCompanyContact,
			productCompanyAddress,
			brandName,
		} = getValues()

		let responseObj: {
			success: boolean
			message: string
		}

		let body: Object

		switch (buttonLabel) {
			case "장비 등록":
				if (
					productName === "" ||
					productVan === "" ||
					productCategory === "" ||
					productBrand === "" ||
					productProductCompany === ""
				) {
					alert("옵션을 모두 입력 하거나 선택 해주세요.")
					return
				}
				body = {
					name: productName,
					van: productVan,
					category: productCategory,
					brand: productBrand,
					productCompany: productProductCompany,
				}

				responseObj = await addProduct(body).unwrap()

				break
			case "제조사 등록":
				if (
					productCompanyName === "" ||
					productCompanyContact === "" ||
					productCompanyAddress === ""
				) {
					alert("옵션을 모두 입력 하거나 선택 해주세요.")
					return
				}
				body = {
					name: productCompanyName,
					contact: productCompanyContact,
					address: productCompanyAddress,
				}

				responseObj = await addProductCompany(body).unwrap()

				break
			case "법인 등록":
				if (brandName === "") {
					alert("옵션을 모두 입력 하거나 선택 해주세요.")
					return
				}
				body = {
					name: brandName,
				}
				responseObj = await addBrand(body).unwrap()

				break
		}

		if (responseObj.success) {
			toast.success(responseObj.message)
			reset()
		} else {
			toast.error(responseObj.message)
		}
	}

	function DataManagementComponent() {
		const [uploadFile, setUploadFile] = useState(null)
		const [isLoading, setIsLoading] = useState(false)
		const uploadFileInputRef = useRef<HTMLInputElement>()
		const todayYear = useDate("yyyy")
		const todayMonth = useDate("MM")

		const onReportDownloadHandler = async () => {
			// const year = prompt("연도를 입력하세요.", todayYear)
			// if (year === null) {
			// 	return
			// }
			// if (year < "2023") {
			// 	alert("2023년 데이터 부터 출력 가능합니다.")
			// 	return
			// }

			const accept = confirm(
				`${todayYear}년 보고서를 다운로드 합니다. 계속 하시겠습니까?`,
			)

			if (!accept) {
				return
			}

			setIsLoading(true)
			await axios
				.get(`/api/store/excel?type=report&year=${todayYear}`, {
					responseType: "blob",
				})
				.then((res) => {
					const blob = new Blob([res.data], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					})
					saveAs(blob, "통합 가맹점 리스트.xlsx")
					setIsLoading(false)
				})
		}

		const onCountUploadHandler = () => {
			uploadFileInputRef.current.value = null
			uploadFileInputRef.current.click()
		}

		const onChangeFileHandler = (e) => {
			setUploadFile(e.target.files[0])
		}

		const onUploadHandler = useCallback(async () => {
			const year = prompt("연도를 입력하세요.", todayYear)
			if (year === null) {
				setUploadFile(null)
				return
			}
			const month = prompt("월을 입력하세요.", todayMonth)
			if (month === null) {
				setUploadFile(null)
				return
			}

			if (Number(year) === NaN && Number(month) === NaN) {
				alert("숫자만 입력 해주세요.")
				setUploadFile(null)
				return
			}

			const accept = confirm(`${year}년 ${month}월 데이터를 입력 하시겠습니까?`)

			if (!accept) {
				setUploadFile(null)
				return
			}
			const formData = new FormData()
			formData.append("file", uploadFile)

			setIsLoading(true)
			try{

				const response = await axios.post(
					`/api/store/excel?year=${year}&month=${month}`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					},
				)
				setIsLoading(false)
				if (response.data) {
					setUploadFile(null)
					alert(response.data.message)
				}
			}catch(e){
				console.log(e)
				alert('업로드 중 에러 발생.')
			}
		}, [todayYear, todayMonth, uploadFile])

		const onSampleDownloadHandler = async () => {
			setIsLoading(true)
			await axios
				.get("/api/store/excel?type=countUp", { responseType: "blob" })
				.then((res) => {
					const blob = new Blob([res.data], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					})

					saveAs(blob, "가맹점 건수입력 샘플.xlsx")
					setIsLoading(false)
				})
		}

		//
		// 혹시 이거 필요하면 api 주소 변경해야 함.
		//
		// const onClosedStoreFixHandler = async () => {
		// 	const year = prompt(
		// 		"폐업 가맹점을 삭제 할 연도를 입력하세요.",
		// 		todayYear - 1,
		// 	)

		// 	if (year && year === todayYear) {
		// 		alert("현재 연도의 데이터를 수정 할 수 없습니다.")
		// 		return
		// 	} else {
		// 		await axios.delete(`/api/store?year=${year}`).then((res) => {
		// 			if (res.data) {
		// 				alert(res.data.message)
		// 			}
		// 		})
		// 	}
		// }

		useEffect(() => {
			if (uploadFile) {
				onUploadHandler()
			}
		}, [uploadFile, onUploadHandler])

		return (
			<>
				<Heading title="가맹점 데이터 관리" />
				<div
					className="
                        gap-3
                        grid
                        w-[40vh]
                        pt-4
                        pl-10
                    "
				>
					<Button
						outline
						label="가맹점 보고서 다운로드"
						onClick={onReportDownloadHandler}
					/>
					<Button
						outline
						label="업로드 샘플 다운로드"
						onClick={onSampleDownloadHandler}
					/>
					<Button
						outline
						label="거래건수 업로드"
						onClick={onCountUploadHandler}
					/>
				</div>

				<input
					className="hidden"
					ref={uploadFileInputRef}
					type="file"
					onChange={onChangeFileHandler}
				/>
			</>
		)
	}

	function RegisterProductComponent() {
		return (
			<>
				<Heading title="장비 등록" />
				<div className="grid grid-cols-4 gap-4 ">
					<div className="col-span-4">
						<Input
							id="productName"
							label="모델명"
							required
							errors={errors}
							register={register}
						/>
					</div>
					<div className="col-span-2">
						<ListboxButton
							control={control}
							options={vanItems}
							placeholder="VAN"
							name="productVan"
						/>
					</div>
					<div className="col-span-2">
						<ListboxButton
							control={control}
							options={categoryItems}
							placeholder="카테고리"
							name="productCategory"
						/>
					</div>
					<div className="col-span-2">
						<ListboxButton
							control={control}
							options={productCompanies}
							placeholder="제조사"
							name="productProductCompany"
						/>
					</div>
					<div className="col-span-2">
						<ListboxButton
							control={control}
							options={brands}
							placeholder="법인명"
							name="productBrand"
						/>
					</div>

					<div className="col-span-1 col-start-4">
						<Button
							label="장비 등록"
							onClick={(e) =>
								onSubmitHandler((e.target as HTMLElement).innerText)
							}
						/>
					</div>
				</div>
			</>
		)
	}

	function RegisterProductCompanyComponent() {
		return (
			<>
				<Heading title="제조사 등록" />
				<div className="grid grid-cols-4 gap-4 pt-5">
					<div className="col-span-2">
						<Input
							id="productCompanyName"
							label="제조사명"
							register={register}
							errors={errors}
						/>
					</div>
					<div className="col-span-2">
						<Input
							id="productCompanyContact"
							label="연락처"
							register={register}
							errors={errors}
						/>
					</div>
					<div className="col-span-4">
						<Input
							id="productCompanyAddress"
							label="주소"
							register={register}
							errors={errors}
						/>
					</div>
					<div className="col-start-4">
						<Button
							label="제조사 등록"
							onClick={(e) =>
								onSubmitHandler((e.target as HTMLElement).innerText)
							}
						/>
					</div>
				</div>
			</>
		)
	}

	function RegisterBrandComponenet() {
		return (
			<>
				<Heading title="법인 등록" />
				<div className="grid grid-cols-4 gap-4 pt-4">
					<div className="col-span-4">
						<Input
							id="brandName"
							label="법인명"
							register={register}
							errors={errors}
						/>
					</div>
					<div className="col-start-4">
						<Button
							label="법인 등록"
							onClick={(e) =>
								onSubmitHandler((e.target as HTMLElement).innerText)
							}
						/>
					</div>
				</div>
			</>
		)
	}

	return (
		<Container>
			<div className="grid grid-cols-12 gap-6 ">
				<div
					className="
                        col-span-6
                        h-[30vh]
                    "
				>
					<DataManagementComponent />
				</div>

				<div
					className="
                        col-span-6
                        h-[40vh]
                    "
				>
					<RegisterProductComponent />
				</div>

				<div
					className="
                        col-span-6
                        h-[40vh]
                        border-t-2
                        pt-4
                    "
				>
					<RegisterProductCompanyComponent />
				</div>
				<div
					className="
                        col-span-6
                        h-[40vh]
                        border-t-2
                        pt-4
                    "
				>
					<RegisterBrandComponenet />
				</div>
			</div>
		</Container>
	)
}

export default Admin
