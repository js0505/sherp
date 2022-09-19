import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "../../../lib/auth/password"
import User from "../../../models/User"
import dbConnect from "../../../lib/mongoose/dbConnect"

// next-auth에서 몽구스 연결이 어려워서 다른 분의 아이디어를 얻어서 이렇게 일단 연결.

dbConnect()

export default NextAuth({
	secret: process.env.NEXT_PUBLIC_SECRET,
	providers: [
		CredentialsProvider({
			async authorize(credentials, req) {
				try {
					const user = await User.findOne({ email: credentials.email })

					if (!user) {
						throw new Error("이메일이 존재하지 않습니다.")
					}

					const isPasswordValid = await verifyPassword(
						credentials.password,
						user.password,
					)

					if (!isPasswordValid) {
						throw new Error("비밀번호가 틀렸습니다.")
					}

					return {
						name: user.name,
						email: user.email,
						// user id 전달되지 않아 편법으로 전달..
						image: {
							_id: user._id,
						},
					}
				} catch (e) {
					console.log(e)
				}
			},
		}),
	],
})
