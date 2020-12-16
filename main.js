function curlToPython(curl){

	var url = null
	var queryParams = {}
	var headers = {}
	var data = null


	var splits = curl.split(" ");
	var lines = []
	var line = []
	for(var s in splits){
		var val = splits[s]
		if(val[0]=="'"){
			val = val.substr(1,val.length)
		}
		if(val[val.length-1]=="'"){
			val = val.substr(0,val.length-1)
		}
		if(val.indexOf("\\") == 0){
			if(val.length == 2){
				lines.push(line)
				line = []
				continue
			}
		}
		if(val!=""){
			line.push(val)	
		}
	}
	console.log(lines)
	for(line in lines){
		if(lines[line][0].indexOf("curl") == 0){
			url = lines[line][1]
		}
		if(lines[line][0].indexOf("-H") == 0){
			var key = null
			var val = ""
			if(lines[line][1].indexOf(":") == lines[line][1].length-1){
				key = lines[line][1]
				for(var i=2;i<=lines[line].length-1;i++){
					val += lines[line][i]+" "
				}
				headers[key] = val.trim()
			}
		}
		if(lines[line][0].indexOf("--data") == 0){
			var val = ""
			for(var i=1;i<=lines[line].length-1;i++){
				val += lines[line][i]+" "
			}
			data = val.trim()
		}
	}

	console.log(url)
	var rawQueryParams = url.substr(url.indexOf("?")+1).split("&")
	for(rawQueryParam in rawQueryParams){
		var qps = rawQueryParams[rawQueryParam].split("=")
		var key = qps[0]
		var val = ""
		for(var i=1;i<=qps.length-1;i++){
			val += qps[i]+"="
		}
		val = val.substr(0,val.length-1)
		queryParams[key] = val
	}
	console.log(queryParams)
	console.log(headers)
	console.log(data)



	var pyCode = "import requests\n\n"
	pyCode += "headers = {\n"
	for(header in headers){
		pyCode += "\t'"+header.substr(0,header.length-1)+"' : '"+headers[header]+"',\n" 
	}
	pyCode += "}\n\n"
	pyCode += "params = {\n"
	for(param in queryParams){
		pyCode += "\t'"+param+"' : '"+queryParams[param]+"',\n" 
	}
	pyCode += "}\n\n"
	pyCode += "data = '"+data+"'\n\n"
	pyCode += "rq = requests.post('"+url+"',headers=headers, params=params, data=data)\n\n\n"
	document.getElementById("curl_io").value = pyCode

}

window.onload = function(){
	document.getElementById("curl_io").focus()
	document.getElementById("curl_io").onclick = function(){
		if(document.getElementById("curl_io").value.indexOf("curl") == 0){
			curlToPython(document.getElementById("curl_io").value)
		}
	}
}