import { ColorRing } from "react-loader-spinner"

export default function Loader() {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center 
        bg-gray-300 bg-opacity-30"
		>
			<ColorRing
				visible={true}
				height="80"
				width="80"
				ariaLabel="blocks-loading"
				wrapperStyle={{}}
				wrapperClass="blocks-wrapper"
				colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
			/>
		</div>
	)
}
