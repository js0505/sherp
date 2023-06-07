import { create } from "zustand"

interface DetailRepairModal {
	isOpen: boolean
	repairId: string
	setRepairId: (repairId: string) => void
	onOpen: () => void
	onClose: () => void
}

const useDetailRepairModal = create<DetailRepairModal>((set) => ({
	isOpen: false,
	repairId: "",
	setRepairId: (repairId) => set({ repairId }),
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))

export default useDetailRepairModal
