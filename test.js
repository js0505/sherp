const fs = require("fs")

const jsonFile = fs.readFileSync("./backupjson.json", "utf8")
const jsonData = JSON.parse(jsonFile)
let newJson = []
jsonData.forEach((item) => {
	switch (item.user.$oid) {
		case "63250f49bb50b9eee251a024":
			item.user = "신지수"
			break
		case "6328438ce83f778d43d326f1":
			item.user = "장문광"
			break
		case "63298d78e21d5c496e4357a1":
			item.user = "이재원"
			break
		case "632a9e89e21d5c496e4357da":
			item.user = "문승필"
	}

	newJson.push(item)
})

fs.writeFileSync("edited-json.json", JSON.stringify(newJson))
