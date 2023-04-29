import { useForm } from "react-hook-form"

import PageTitle from "../../components/ui/page-title"
import { usePlainFetcherMutation } from "../../query/api"

function ProductCompanyPage() {
	const [plainFetcher] = usePlainFetcherMutation()

	const { register, handleSubmit, reset } = useForm({
		mode: "onSubmit",
		defaultValues: { name: "", contact: "", address: "" },
	})

	const submitHandler = async (formData) => {
		const body = {
			...formData,
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
			reset()
		}
	}
	return (
		<>
			<PageTitle title="제조사 등록" />
			<section className="container lg:w-3/6">
				<form className="grid gap-4" onSubmit={handleSubmit(submitHandler)}>
					<div>
						<label className="input-label">제조사명</label>
						<input
							className="input-text"
							{...register("name", { required: true })}
						/>
					</div>
					<div>
						<label className="input-label">연락처</label>
						<input
							className="input-text"
							{...register("contact", { required: true })}
						/>
					</div>
					<div>
						<label className="input-label">주소</label>
						<input
							className="input-text"
							{...register("address", { required: true })}
						/>
					</div>
					<div>
						<button className="input-button">등록</button>
					</div>
				</form>
			</section>
		</>
	)
}

export default ProductCompanyPage
