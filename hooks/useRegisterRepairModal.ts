import { create } from "zustand"

interface RegisterRepairModal {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

const useRegisterRepairModal = create<RegisterRepairModal>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))

export default useRegisterRepairModal
