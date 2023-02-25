export function editItemforDropdownButton(items) {
	let editedItems = []
	if (items) {
		items.map((item) =>
			editedItems.push({
				value: item._id,
				label: item.name,
			}),
		)
	}

	return editedItems
}

export function editUserforDropdown(items) {
	let editedItems = []
	if (items) {
		items.map((item) =>
			editedItems.push({
				value: item.name,
				label: item.name,
			}),
		)
	}

	return editedItems
}
