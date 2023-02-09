import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function ToastMessageComponent() {
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				draggable
				pauseOnFocusLoss={false}
				theme="light"
			/>
		</>
	)
}
