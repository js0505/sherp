import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/db/mongodbConnect"
import { UserModel } from "@/models/User"
import { verifyPassword } from "../../../lib/auth/password"

export const authOptions = {
	secret: process.env.NEXT_PUBLIC_SECRET,
	adabter: MongoDBAdapter(clientPromise),
	providers: [
		CredentialsProvider({
			async authorize(credentials, req) {
				try {
					const user = await UserModel.findOne({ email: credentials.email })
					if (!user) {
						// throw new Error("이메일이 존재하지 않습니다.")
						return null
					}
					const isPasswordValid = await verifyPassword(
						credentials.password,
						user.password,
					)
					if (!isPasswordValid) {
						// throw new Error("비밀번호가 틀렸습니다.")
						return null
					}
					return {
						name: user.name,
						email: user.email,
					}
				} catch (e) {
					console.log(e)
				}
			},
		}),
	],
}

export default NextAuth(authOptions)
