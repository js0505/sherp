import nextConnect from "next-connect"

const handler = nextConnect()

handler.get(async function (req, res) {
	res.status(200).json({ message: "Hello next" })
})
export default handler
