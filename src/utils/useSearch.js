import { useEffect, useState } from "react";

export default function useSearch(query, page) {
	const [searchResult, setSearchResult] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState(null);

	useEffect(() => {
		setSearchResult([]);
		setTotalCount(0);

		setError(false);
	}, [query]);

	useEffect(() => {
		// console.log(query);
        if(query!==''){
            fetch(
                `https://api.github.com/search/repositories?q=${query}&per_page=10&page=${page + 1}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
                    },
                }
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("rate limiter !!");
                })
                .then((data) => {
                    setSearchResult(data.items);
                    setTotalCount(data.total_count);
                })
                .catch((e) => setError(e.message));
        }
	}, [query, page]);

	return { searchResult, error, totalCount };
}
