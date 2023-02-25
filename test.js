const fs = require("fs")

const jsonFile = fs.readFileSync("./backupjson.json", "utf8")
const jsonData = JSON.parse(jsonFile)
let newJson = []
jsonData.forEach((item) => {
	if (item.completeUser) {
		switch (item.completeUser.$oid) {
			case "63250f49bb50b9eee251a024":
				item.completeUser = "신지수"
				break
			case "6328438ce83f778d43d326f1":
				item.completeUser = "장문광"
				break
			case "63298d78e21d5c496e4357a1":
				item.completeUser = "이재원"
				break
			case "632a9e89e21d5c496e4357da":
				item.completeUser = "문승필"
		}
	}

	newJson.push(item)
})

fs.writeFileSync("edited-json.json", JSON.stringify(newJson))
