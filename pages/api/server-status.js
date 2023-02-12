import nextConnect from "next-connect"
const handler = nextConnect()

handler.get(async function (req, res) {
	try {
		res.status(200).json({ success: true })
	} catch (e) {
		res
			.status(200)
			.json({
				success: false,
				message: "서버와 연결이 끊어졌습니다. 새로고침을 시도 하거나 관리자에게 문의 바랍니다.",
				error: e,
			})
	}
})
export default handler
