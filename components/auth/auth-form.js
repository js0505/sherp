import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useRef, useState } from "react"

async function createUserFetch(email, name, password) {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		body: JSON.stringify({ email, name, password }),
		headers: {
			"Content-Type": "application/json",
		},
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || "유저 생성 중 에러 발생.")
	}

	return data
}

function AuthForm() {
	const [isLogin, setIsLogin] = useState(true)
	const emailInputRef = useRef()
	const nameInputRef = useRef()
	const passwordInputRef = useRef()
	const router = useRouter()

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState)
	}

	async function submitHandler(e) {
		e.preventDefault()
		const enteredEmail = emailInputRef.current.value
		const enteredPassword = passwordInputRef.current.value
		const enteredName = nameInputRef.current?.value

		if (isLogin) {
			try {
				const result = await signIn("credentials", {
					redirect: false,
					email: enteredEmail,
					password: enteredPassword,
				})
				if (!result.error) {
					router.replace("/")
				}
			} catch (e) {
				console.log("this")
				console.log(e)
			}
		} else {
			try {
				const result = await createUserFetch(
					enteredEmail,
					enteredName,
					enteredPassword,
				)
				console.log(result)
			} catch (e) {
				console.log("error")
				console.log(e)
			}
		}
	}
	return (
		<section className="md:flex md:justify-center">
			<form onSubmit={submitHandler} className="mx-3 lg:w-1/3 ">
				{!isLogin && (
					<div>
						<label className="input-label" htmlFor="name">
							이름
						</label>
						<input
							className="input-text"
							type="name"
							id="name"
							required
							ref={nameInputRef}
						/>
					</div>
				)}
				<div>
					<label className="input-label" htmlFor="email">
						이메일
					</label>
					<input
						className="input-text"
						type="email"
						id="email"
						required
						ref={emailInputRef}
					/>
				</div>
				<div>
					<label className="input-label" htmlFor="password">
						비밀번호
					</label>
					<input
						className="input-text"
						type="password"
						id="password"
						required
						ref={passwordInputRef}
					/>
				</div>
				<div className="flex flex-col mt-4 ">
					<button className="input-button md:w-full">
						{isLogin ? "로그인" : "계정 생성"}
					</button>
					<div className="text-center mt-4" onClick={switchAuthModeHandler}>
						{isLogin ? "새로운 계정 생성" : "기존 계정으로 로그인"}
					</div>
				</div>
			</form>
		</section>
	)
}

export default AuthForm
