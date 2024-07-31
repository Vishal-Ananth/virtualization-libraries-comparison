import axios from "axios";
import { useEffect, useState } from "react";

export default function useSearch(query, page) {
	const [repositories, setRepositories] = useState([]);
	const [hasNext, setHasNext] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		setRepositories([]);
		setTotalItems(0);
	}, [query]);

	useEffect(() => {
		const abortController = new AbortController();
		if (query !== "") {
			setLoading(true);
			setError(false);
			const url = new URL("https://api.github.com/search/repositories");
			url.searchParams.set("q", query);
			url.searchParams.set("per_page", 10);
			url.searchParams.set("page", page);

			fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
				},
				signal: abortController.signal,
			})
				.then((res) => {
					console.log(`new fetch for ${query}`);
					console.log("Calls left : ", res.headers.get("x-ratelimit-remaining"));
					const check = res.headers.get("link").includes('rel="next"');
					setHasNext(check);
					setLoading(false);
					return res.json();
				})
				.then((data) => {
					setRepositories(data.items);
					setTotalItems(data.total_count);
					setLoading(false);
				})
				.catch((e) => {
					// console.error(e);
					setError(e.message);
					setLoading(false);
				});
		}

		return () => {
			abortController.abort();
		};
	}, [query, page]);

	return { repositories, hasNext, loading, error, totalItems };
}

/*

axios({
				method: "GET",
				url: "https://api.github.com/search/repositories",
				params: { q: query, per_page: 10, page: page },
				
				,
			})
				.then((response) => {
					console.log("Calls left : ", response.headers.get("x-ratelimit-remaining"));
					setHasNext(response.headers.link.includes('rel="next"'));
					return response.data;
				})

*/
