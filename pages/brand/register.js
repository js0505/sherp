import { useRef } from "react"
import PageTitle from "../../components/ui/page-title"
import { usePlainFetcherMutation } from "../../query/api"

function BrandPage() {
	const brandNameInputRef = useRef()
	const [plainFetcher] = usePlainFetcherMutation()

	async function submitHandler(e) {
		e.preventDefault()

		const brandName = brandNameInputRef.current.value

		const body = {
			name: brandName,
		}

		const accept = confirm("등록 하시겠습니까?")
		if (accept) {
			const { data } = await plainFetcher({
				method: "POST",
				url: "brand",
				body,
			})

			if (!data.result) {
				alert(`${data.message}`)
				return
			}

			alert(`${data.result.name} 등록완료.`)
			brandNameInputRef.current.value = ""
		}
	}
	return (
		<>
			<PageTitle title="법인명 등록" />
			<section className="container lg:w-3/6">
				<form className="grid gap-4" onSubmit={submitHandler}>
					<div>
						<label className="input-label">법인명</label>
						<input className="input-text" required ref={brandNameInputRef} />
					</div>
					<div>
						<button className="input-button">등록</button>
					</div>
				</form>
			</section>
		</>
	)
}
export default BrandPage
