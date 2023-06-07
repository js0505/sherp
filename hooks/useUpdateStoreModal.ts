import { create } from "zustand"

interface UpdateStoreModal {
	isOpen: boolean
	storeId: string
	setStoreId: (storeId: string) => void
	onOpen: () => void
	onClose: () => void
}

const useUpdateStoreModal = create<UpdateStoreModal>((set) => ({
	isOpen: false,
	storeId: "",
	setStoreId: (storeId) => set({ storeId }),
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))

export default useUpdateStoreModal
