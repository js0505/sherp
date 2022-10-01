import nextConnect from "next-connect"
import Product from "../../../models/Product"
import ProductCompany from "../../../models/ProductCompany"
import Store from "../../../models/Store"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

// // 모든 등록된 장비 불러오기
// handler.get(async function (req, res) {
// 	console.log(req.query)
// 	await dbConnect()

// 	try {
// 		const getAllProducts = await Product.find({})
// 			.populate({ path: "productCompany", model: ProductCompany })
// 			.populate({ path: "brand", model: Brand })
// 			.exec()

// 		res.status(200).json({ products: getAllProducts, success: true })
// 	} catch (e) {
// 		console.log(e)
// 		res.status(200).json({
// 			message: "장비 정보 가져오는 중 에러 발생",
// 			success: false,
// 			error: e,
// 		})
// 	}
// })

// 가맹점 신규 등록
handler.post(async function (req, res) {
	const {
		user,
		storeName,
		businessNum,
		van,
		vanId,
		vanCode,
		owner,
		city,
		address,
		contact,
		product,
		cms,
		contractDate,
		note,
		contractImg,
		isBackup,
	} = req.body

	try {
		const newStore = new Store({
			user,
			storeName,
			businessNum,
			van,
			vanId,
			vanCode,
			owner,
			city,
			address,
			contact,
			product,
			cms,
			contractDate,
			note,
			contractImg,
			isBackup,
		})
		newStore.save()
		res
			.status(201)
			.json({ message: "가맹점 저장 성공", result: newStore, success: true })
	} catch (e) {
		res
			.status(500)
			.json({ message: "가맹점 저장 중 오류", error: e, success: false })
	}
})

export default handler

// const [selectedProducts, setSelectedProducts] = useState([])
// const [isBackup, setIsBackup] = useState(isBackupItems[0]._id)
// const [selectedVANName, setSelectedVANName] = useState(vanItems[0]._id)
// const [selectedCity, setSelectedCity] = useState(cityItems[0]._id)
// const [selectedUser, setSelectedUser] = useState(users[0]._id)
// const [contractDate, setContractDate] = useState(formattedToday)
// const storeNameInputRef = useRef()
// const businessNumInputRef = useRef()
// const ownerInputRef = useRef()
// const contactInputRef = useRef()
// const vanIdInputRef = useRef()
// const vanCodeInputRef = useRef()
// const addressInputRef = useRef()
// const cmsInputRef = useRef()
// const noteInputRef = useRef()