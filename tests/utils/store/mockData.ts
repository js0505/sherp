import { format } from "date-fns"
import { Store } from "@/models/Store"

const year = format(new Date(), "yyyy")
const month = format(new Date(), "MM")
const date = format(new Date(), "dd")
const contractDate = `${year}-${month}-${date}`

export const testStore: Store = {
	user: "신지수",
	vanCode: "code",
	vanId: "",
	note: "",
	contractImg: [],
	contractDate,
	storeName: "가맹점생성테스트",
	businessNum: 9999999999,
	isBackup: false,
	owner: "김미래",
	product: {
		cat: false,
		kiosk: true,
		pos: true,
		printer: false,
		router: false,
	},
	van: "KICC",
	city: "시흥시",
	address: "시흥시 주소 주소",
	cms: 33000,
	isCorporation: false,
	inOperation: "영업중",
	contact: "",
	closeDate: "",
	closeYear: "",
	creditCount: [{ year, month, cms: 33000, inOperation: "영업중", count: 0 }],
}
