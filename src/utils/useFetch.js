import { useEffect, useState } from "react";

export default function useFetch(searchQuery, noOfFetchItems = 100, page = 1) {
	const [data, setData] = useState([]);
	const [totalCount, setTotalCount] = useState(null);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading("Loading...");
		setData([]);
		setError(null);
		setTotalCount(null);
		const abortToken = new AbortController();

		if (searchQuery.length !== 0) {
			fetch(
				`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
					},
					signal: abortToken.signal,
				}
			)
				.then((res) => res.json())
				.then((data) => {
					setLoading(false);
					setError(false);
					setTotalCount(data.total_count);
					setData((prev) => [...prev, ...data.items]);
				})
				.catch((e) => {
					setLoading(false);
					setError(e.message);
				});
		}

		return () => {
			abortToken.abort("debouncing value");
		};
	}, [noOfFetchItems, page, searchQuery]);

	return { data, loading, error, totalCount };
}

/*
axios({
	method: "get",
	url: "https://api.github.com/search/repositories",
	params: {
		q: searchQuery,
		per_page: noOfFetchItems,
		page: page,
	},
	headers: {
		Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
	},
	cancelToken: source.token,
})
	.then((res) => {
		setLoading(false);
		setError(false);
		setTotalCount(res.data.total_count);
		setData((prev) => [...prev, ...res.data.items]);
	})
	.catch((e) => {
		setError(e);
		setLoading(false);
	});
*/
