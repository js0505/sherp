import { format, differenceInDays, parseISO } from "date-fns"
export const getRepairProductListByState = ({ repairs, state }) => {
	if (repairs) {
		switch (state) {
			case "수리접수":
				const today = new Date()
				const formattedToday = format(today, "yyyy-MM-dd")

				let normalItem = []
				let confirmItem = []
				repairs.forEach((item) => {
					let compareDate = differenceInDays(
						parseISO(formattedToday),
						parseISO(item.date),
					)

					if (compareDate > 6) {
						confirmItem.push(item)
					} else {
						normalItem.push(item)
					}
				})
				return [normalItem, confirmItem]
			case "수리완료":
				return [repairs]
		}
	}
}
