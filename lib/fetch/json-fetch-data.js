export async function fetchHelperFunction(method, url, body = null) {
	let response
	let data

	switch (method) {
		case "GET":
			response = await fetch(url)

			data = await response.json()
			return data
		case "POST":
			try {
				response = await fetch(url, {
					method: method,
					body: JSON.stringify(body),
					headers: {
						"Content-Type": "application/json",
					},
				})

				data = await response.json()
				return data
			} catch (e) {
				console.log(e)
			}

		case "PATCH":
			try {
				response = await fetch(url, {
					method: method,
					body: JSON.stringify(body),
					headers: {
						"Content-Type": "application/json",
					},
				})

				data = await response.json()
				return data
			} catch (e) {
				console.log(e)
			}
	}
}
