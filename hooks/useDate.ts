import { format } from "date-fns"

export default function useDate(dateFormat: string) {
	const today = new Date()
	return format(today, dateFormat)
}
