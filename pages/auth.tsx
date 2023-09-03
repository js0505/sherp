import Button from "@/components/Button"
import Input from "@/components/inputs/Input"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })

	if (session) {
		return {
			redirect: {
				destination: "/store",
				permanent: false,
			},
		}
	}

	return {
		props: {},
	}
}

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

const AuthPage = () => {
	const router = useRouter()
	const [isLogin, setIsLogin] = useState(true)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	})

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState)
	}

	async function submitHandler(formData) {
		const { name, email, password } = formData

		if (isLogin) {
			try {
				const result = await signIn("credentials", {
					redirect: false,
					email,
					password,
				})

				if (!result.ok) {
					alert("로그인 에러")
				} else {
					router.push("/store")
				}
			} catch (e) {
				console.log(e)
			}
		} else {
			try {
				const accept = confirm("계정을 생성 하시겠습니까?")

				if (!accept) {
					return
				} else {
					const result = await createUserFetch(email, name, password)
					if (result.success) {
						alert(`${email} 계정 생성완료`)
						reset()
						switchAuthModeHandler()
					}
				}
			} catch (e) {
				alert("회원가입 실패.")
				console.log(e)
			}
		}
	}

	return (
		<section className="md:flex md:justify-center">
			<form
				onSubmit={handleSubmit(submitHandler)}
				className="flex flex-col gap-4 mx-3 lg:w-1/3"
			>
				{!isLogin && (
					<div>
						<Input label="이름" register={register} errors={errors} id="name" />
					</div>
				)}
				<div>
					<Input
						label="이메일"
						register={register}
						errors={errors}
						id="email"
					/>
				</div>
				<div>
					<Input
						label="비밀번호"
						register={register}
						errors={errors}
						id="password"
						type="password"
					/>
				</div>
				<div className="flex flex-col mt-4 ">
					<Button label={isLogin ? "로그인" : "계정 생성"} type="submit" />

					<div className="mt-4 text-center" onClick={switchAuthModeHandler}>
						{isLogin ? "새로운 계정 생성" : "기존 계정으로 로그인"}
					</div>
				</div>
			</form>
		</section>
	)
}

export default AuthPage
