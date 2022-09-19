import nextConnect from "next-connect"
import { hashPassword } from "../../../lib/auth/password"
import User from "../../../models/User"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

handler.post(async (req, res) => {
	const data = req.body
	const { email, password, name } = data

	// 데이터 유효성검사 만들어야 함

	const existingUser = await User.findOne({ email: email })

	if (existingUser) {
		res.status(422).json({ message: "이미 가입 된 이메일 입니다." })
		return
	}

	const hashedPassword = await hashPassword(password)

	try {
		const newUser = new User({
			email,
			password: hashedPassword,
			name,
		})
		newUser.save()
	} catch (e) {
		console.log(e)
	}

	res.status(201).json({ message: "유저 생성 완료", success: true })
})

export default handler
