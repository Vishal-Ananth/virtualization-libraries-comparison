import { useEffect, useState } from "react";
import makeFetch from "./makeFetch";

export function useFetch(searchQuery, noOfFetchItems = 100, page = 1) {
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
			const jsonData = makeFetch(
				`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${page}`,
				abortToken
			);

			jsonData
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
