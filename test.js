import callApi from './index.js';

try {
	const url = 'https://your-domain';
	const apiName = 'test';
	const draftId = null; // get it from website preview url
	const args = [ 'arg1', 'arg2' ];
	const startTime = Date.now();
	let ttfb = null; // time to first byte - set with stream callback
	const result = await callApi({ url, apiName, draftId, args, streamCallback: () => ttfb ? null : ttfb = Date.now() - startTime });
	const totalTime = Date.now() - startTime;
	console.log(ttfb, totalTime, result);
}
catch (ex) {
	console.error(ex);
}