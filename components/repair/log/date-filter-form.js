import { useState } from "react"

function RepairLogDateFilterForm(props) {
	const { dateHandler, clearDateHandler } = props
	const [startDateValue, setStartDateValue] = useState("")
	const [endDateValue, setEndDateValue] = useState("")
	function onSubmitHandler(e) {
		e.preventDefault()
		dateHandler(startDateValue, endDateValue)
	}

	function clearFunction() {
		setStartDateValue((value) => (value = ""))
		setEndDateValue((value) => (value = ""))

		clearDateHandler()
	}

	return (
		<form
			onSubmit={onSubmitHandler}
			className="flex justify-center w-full px-3"
		>
			<div className="w-full mr-3">
				<label className="input-label" htmlFor="date">
					시작 일자
				</label>
				<input
					className="input-text"
					id="date"
					type="date"
					value={startDateValue}
					onChange={(e) => setStartDateValue(e.target.value)}
				/>
			</div>
			<div className="w-full mr-3">
				<label className="input-label" htmlFor="date">
					종료 일자
				</label>
				<input
					className="input-text"
					id="date"
					type="date"
					value={endDateValue}
					onChange={(e) => setEndDateValue(e.target.value)}
				/>
			</div>
			<div className="mt-4 flex w-full">
				<button className="input-button w-full mr-2" type="submit">
					검색
				</button>
				<button
					className="input-button w-full"
					type="button"
					onClick={clearFunction}
				>
					초기화
				</button>
			</div>
		</form>
	)
}

export default RepairLogDateFilterForm
