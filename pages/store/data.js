import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import PageTitle from "../../components/ui/page-title"
import { format } from "date-fns"
import { saveAs } from "file-saver"
const StoreDataManagePage = () => {
	const [uploadFile, setUploadFile] = useState(null)
	const uploadFileInputRef = useRef()
	const today = new Date()
	const todayYear = format(today, "yyyy")
	const todayMonth = format(today, "MM")

	const onReportDownloadHandler = async () => {
		const year = prompt("연도를 입력하세요.", todayYear)
		if (year === null) {
			return
		}
		if (year < "2023") {
			alert("2023년 데이터 부터 출력 가능합니다.")
			return
		}
		await axios
			.get(`/api/store/excel?type=report&year=${year}`, {
				responseType: "blob",
			})
			.then((res) => {
				const blob = new Blob([res.data], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				})

				saveAs(blob, "통합 가맹점 리스트.xlsx")
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
			setFile(null)
			return
		}
		const formData = new FormData()
		formData.append("file", uploadFile)

		const response = await axios.post(
			`/api/store/excel?year=${year}&month=${month}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		)
		if (response.data) {
			setUploadFile(null)
			alert(response.data.message)
		}
	}, [todayYear, todayMonth, uploadFile])

	const onSampleDownloadHandler = async () => {
		await axios
			.get("/api/store/excel?type=countUp", { responseType: "blob" })
			.then((res) => {
				const blob = new Blob([res.data], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				})

				saveAs(blob, "가맹점 건수입력 샘플.xlsx")
			})
	}

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
			<PageTitle title="가맹점 데이터 관리" />
			<div className="w-full flex justify-left pl-28 ">
				<div className="flex flex-col justify-around h-30 w-1/5">
					<button
						className="input-button w-full"
						type="button"
						onClick={onReportDownloadHandler}
					>
						보고서 다운로드
					</button>
					{/* <button
						className="input-button w-full mt-10"
						type="button"
						onClick={onClosedStoreFixHandler}
					>
						폐업 가맹점 정리
					</button> */}

					<button
						className="input-button w-full mt-10"
						onClick={onSampleDownloadHandler}
					>
						업로드 샘플 다운로드
					</button>
					<input
						className="hidden"
						ref={uploadFileInputRef}
						type="file"
						onChange={onChangeFileHandler}ㅁ
					/>
					<button
						className="input-button w-full mt-10"
						type="submit"
						onClick={onCountUploadHandler}
					>
						거래건수 데이터 업로드
					</button>
				</div>
			</div>
		</>
	)
}

export default StoreDataManagePage
