import { useRef } from "react"
import { api } from "../../query/api"

function CompanyRegisterForm() {
	const companyNameInputRef = useRef()
	const companyContactInputRef = useRef()
	const companyAddressInputRef = useRef()

	const [plainFetcher] = api.usePlainFetcherMutation()

	const submitHandler = async (e) => {
		e.preventDefault()

		const companyName = companyNameInputRef.current.value
		const companyContact = companyContactInputRef.current.value
		const companyAddress = companyAddressInputRef.current.value

		const body = {
			name: companyName,
			contact: companyContact,
			address: companyAddress,
		}

		const accept = confirm("등록 하시겠습니까?")
		if (accept) {
			const { data: response } = await plainFetcher({
				method: "POST",
				url: "company",
				body,
			})

			if (!response.success) {
				alert(`${response.message}`)
				return
			}

			alert(`${response.result.name} 등록완료.`)
			companyNameInputRef.current.value = ""
			companyContactInputRef.current.value = ""
			companyAddressInputRef.current.value = ""
		}
	}

	return (
		<section className="container lg:w-3/6">
			<form className="grid gap-4" onSubmit={submitHandler}>
				<div>
					<label className="input-label">제조사명</label>
					<input className="input-text" required ref={companyNameInputRef} />
				</div>
				<div>
					<label className="input-label">연락처</label>
					<input className="input-text" required ref={companyContactInputRef} />
				</div>
				<div>
					<label className="input-label">주소</label>
					<input className="input-text" required ref={companyAddressInputRef} />
				</div>
				<div>
					<button className="input-button">등록</button>
				</div>
			</form>
		</section>
	)
}

export default CompanyRegisterForm
