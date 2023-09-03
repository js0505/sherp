import { create } from "zustand"

interface RegisterStoreModal {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

const useRegisterStoreModal = create<RegisterStoreModal>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))

export default useRegisterStoreModal
