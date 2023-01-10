const fs = require("fs")

const jsonFile = fs.readFileSync("./backupjson.json", "utf8")
const jsonData = JSON.parse(jsonFile)
let newJson = []
jsonData.forEach((item) => {
	if (item.vanCode === "false") {
		item.vanCode = ""
	}

	if (item.vanId === "false") {
		item.vanId = ""
	}
	if (item.note === "false") {
		item.note = ""
	}
	if (item.contractDate === "false") {
		item.contractDate = ""
	}
	if (item.contractDate === "") {
		item.contractDate = "2023-01-01"
	}

	newJson.push(item)
})

fs.writeFileSync("edited-json.json", JSON.stringify(newJson))
