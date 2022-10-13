export default function DetailListItem(props) {
	return (
		<div className="px-4 py-2 lg:flex lg:h-18 ">
			<div className="text-gray-700  font-normal mb-2 lg:mb-1 text-base lg:basis-1/3 lg:h-full lg:pl-3 ">
				{props.title}
			</div>
			<div className="lg:w-full lg:h-full whitespace-pre-wrap text-base">
				{props.desc || props.children}
			</div>
		</div>
	)
}
