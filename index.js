/**
 * fetches API response without any processing
 */
const callApi = async ({ url, apiName, draftId, args, streamCallback }) => {

	// make the API call with POST
	const body = JSON.stringify({ _request: 'api', apiName, version: { draft_id: draftId }, args });
	const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
	const response = await fetch(url, { method: 'POST', body, headers });

	// response initial section is response html - then comes the json data that contains refs and query id
	let responseStr = '';

	// read the response chunks in a loop - limit number of reads to prevent infinite loops just in case
	// eslint-disable-next-line no-undef
	const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
	for (let i = 0; i < 100000; i++) {

		// read a chunk of response from the stream
		const chunk = await reader.read();
		// console.log(chunk?.value);

		// if we received a chunk of data, process it with callback function
		if (chunk?.value) {
			responseStr += chunk.value; // add the chunk to the raw response string
			const response = parseResponse(responseStr); // parse the whole response
			if (response.error) { throw new Error(response.error); } // if there was an error, call the error handler and exit
			if (streamCallback) await streamCallback(response.string); // call stream function to process the full response string received so far
		}

		// if the stream is done exit the loop
		if (chunk?.done) break;
	}

	// parse the response and return it
	const parsedResponse = parseResponse(responseStr);
	if (parsedResponse.error) { throw new Error(response.error); } // if there was an error, call the error handler and exit
	return parsedResponse.string ? { ...parsedResponse.json, response: parsedResponse.string } : parsedResponse.json;
};

/**
 * parses response
 */
const parseResponse = rawResponse => {

	// process and display response - if an empty section is sent, ignore it - may happen if we get an error at the beginning of a stream
	const sections = rawResponse.split('\x01').filter(section => section);

	// extract sections into parsed object but keep the raw data in case there is a parse error
	const response = { raw: rawResponse };

	// get the string response
	const responseStr = sections.find(section => section.startsWith('\x03'));
	if (responseStr) response.string = responseStr.substring(1);

	// get the json response
	const responseJson = sections.find(section => section.startsWith('\x04'));
	if (responseJson && validJson(responseJson.substring(1))) response.json = JSON.parse(responseJson.substring(1));

	// if there was an error, show it
	let responseError = sections.find(section => section.startsWith('\x05'));
	if (responseError) response.error = responseError.substring(1);

	// return parsed response
	return response;
};

/**
 * returns if a json is valid or not
 */
const validJson = jsonStr => {
	try {
		JSON.parse(jsonStr);
		return true;
	}
	catch (ex) {
		return false;
	}
};

// export method to call WebDigital API
export default callApi;