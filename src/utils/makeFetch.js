export default async function makeFetch(url, abortToken = new AbortController()) {
	const promiseReturned = await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
		},
		signal: abortToken.signal,
	});
	return promiseReturned.json();
}
