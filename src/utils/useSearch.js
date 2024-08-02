import { useEffect, useState } from "react";

export default function useSearch(query, page) {
	const [hasNext, setHasNext] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorOne, setErrorOne] = useState(null);
	const [errorTwo, setErrorTwo] = useState(null);
	const [totalItems, setTotalItems] = useState(0);

	const [repo1, setRepo1] = useState([]);
	const [repo2, setRepo2] = useState([]);

	// useEffect(() => {
	// 	console.log("Repo1", repo1);
	// }, [repo1]);

	// useEffect(() => {
	// 	console.log("Repo2", repo2);
	// }, [repo2]);

	useEffect(() => {
		setRepo1([]);
		setRepo2([]);
		setTotalItems(0);
	}, [query]);

	useEffect(() => {
		// const abortController = new AbortController();
		if (query !== "" && page < 100) {
			// setLoading(true);
			setErrorOne(false);
			setErrorTwo(false);
			const urlOne = new URL("https://api.github.com/search/repositories");
			urlOne.searchParams.set("q", query);
			urlOne.searchParams.set("per_page", 10);
			urlOne.searchParams.set("page", page);

			const urlTwo = new URL("https://api.github.com/search/repositories");
			urlTwo.searchParams.set("q", query);
			urlTwo.searchParams.set("per_page", 10);
			urlTwo.searchParams.set("page", page + 1);

			fetch(urlOne, {
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
				},
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					// throw new Error("First Error");
				})
				.then((data) => {
					// console.log(data);
					setRepo1(data.items);
					setTotalItems(data.total_count);
				})
				.catch((e) => {
					setErrorOne(e.message);
				});

			fetch(urlTwo, {
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
				},
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					// throw new Error("Second error");
				})
				.then((data) => setRepo2(data.items))
				.catch((e) => setErrorTwo(e.message));
		}
		// return () => {
		// 	abortController.abort();
		// };
	}, [query, page]);

	return { repo1, repo2, hasNext, loading, errorOne, errorTwo, totalItems };
}
