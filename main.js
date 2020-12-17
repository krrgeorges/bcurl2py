var elem_id = "curl_io"

function parseCurl(curl){
	var curlArgs = {}
	curlArgs.url = null
	curlArgs.queryParams = {}
	curlArgs.headers = {}
	curlArgs.data = null

	var splits = curl.split(" ");
	curlArgs.lines = []
	var line = []
	for(var s in splits){
		var val = splits[s]
		if(val[0]=="'"){val = val.substr(1,val.length)}
		if(val[val.length-1]=="'"){val = val.substr(0,val.length-1)}
		if(val.indexOf("\\") == 0){
			if(val.length == 2){
				curlArgs.lines.push(line)
				line = []
				continue
			}
		}
		if(val!=""){line.push(val)	}
	}
	for(line in curlArgs.lines){
		if(curlArgs.lines[line][0].indexOf("curl") == 0){curlArgs.url = curlArgs.lines[line][1]}
		if(curlArgs.lines[line][0].indexOf("-H") == 0){
			var key = null
			var val = ""
			if(curlArgs.lines[line][1].indexOf(":") == curlArgs.lines[line][1].length-1){
				key = curlArgs.lines[line][1]
				for(var i=2;i<=curlArgs.lines[line].length-1;i++){val += curlArgs.lines[line][i]+" "}
				curlArgs.headers[key] = val.trim()
			}
		}
		if(curlArgs.lines[line][0].indexOf("--data") == 0){
			var val = ""
			for(var i=1;i<=curlArgs.lines[line].length-1;i++){val += curlArgs.lines[line][i]+" "}
			curlArgs.data = val.trim()
		}
	}
	var rawQueryParams = curlArgs.url.substr(curlArgs.url.indexOf("?")+1).split("&")
	for(rawQueryParam in rawQueryParams){
		var qps = rawQueryParams[rawQueryParam].split("=")
		var key = qps[0]
		var val = ""
		for(var i=1;i<=qps.length-1;i++){val += qps[i]+"="}
		val = val.substr(0,val.length-1)
		curlArgs.queryParams[key] = val
	}
	curlArgs.urlWithoutQP = curlArgs.url.substr(0,curlArgs.url.indexOf("?"))
	return curlArgs
}


function generatePythonCode(headers,queryParams,data,url,urlWithoutQP){
	var pyCode = "import requests\n\n"
	pyCode += "headers = {\n"
	for(header in headers){pyCode += "\t'"+header.substr(0,header.length-1)+"' : '"+headers[header]+"',\n" }
	pyCode += "}\n\n"
	pyCode += "params = {\n"
	for(param in queryParams){pyCode += "\t'"+param+"' : '"+queryParams[param]+"',\n" }
	pyCode += "}\n\n"
	pyCode += "data = '"+data+"'\n\n"
	pyCode += "rq = requests.post('"+urlWithoutQP+"',headers=headers, params=params, data=data)\n\n\n"
	return pyCode
}

function curlToPython(curl){
	var curlArgs = parseCurl(curl)
	console.log(curlArgs)
	var pyCode = generatePythonCode(curlArgs.headers,curlArgs.queryParams,curlArgs.data,curlArgs.url,curlArgs.urlWithoutQP)
	document.getElementById(elem_id).value = pyCode
	document.getElementById(elem_id).select()
	document.execCommand('copy')
}


window.onload = function(){
	document.getElementById(elem_id).focus()
	document.getElementById(elem_id).onclick = function(){
		if(document.getElementById("curl_io").value.indexOf("curl ") == 0){
			curlToPython(document.getElementById("curl_io").value)
		}
	}
}