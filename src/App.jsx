import "./App.css";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import Card from "./Component/Card";
import { useEffect, useState } from "react";

function App() {
	const [repositories, setRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState(null);
	const [cancelToken, setCancelTOken] = useState(null);

	useEffect(() => {
		console.log(repositories);
	}, [repositories]);

	function makeFetch(text) {
		fetch(`https://api.github.com/search/repositories?q=${text}&per_page=10&page=${page + 1}`, {
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
			},
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error("rate limiter !!");
			})
			.then((data) => {
				setRepositories((prev) => prev.toSpliced(0, 10, ...data.items));
				setTotalCount(data.total_count);
			})
			.catch((e) => setError(e.message));
	}

	if (repositories.length === 0) {
		setRepositories(Array(1000).fill(null));
	}

	function isItemLoaded(index) {
		return index < repositories.length && repositories[index] !== null;
	}

	function loadMoreItems(startIndex, stopIndex) {
		let noOfElements = 0;
		if (typeof cancelToken === "function") {
			cancelToken();
		}

		setPage(Math.floor(startIndex / 10));
		if (startIndex % 10 < 5) {
			console.log(startIndex % 5);
			console.log("fetch 10 elements");
			noOfElements = 10;
		} else {
			console.log("fetch 20 elements");
			noOfElements = 20;
		}
		const signal = new AbortController();
		setCancelTOken(signal.abort);
		return fetch(
			`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfElements}&page=${
				Math.floor(startIndex / 10) + 1
			}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
				},
				signal,
			}
		)
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error("rate limiter !!");
			})
			.then((data) => {
				setRepositories((prev) =>
					prev.toSpliced(Math.floor(startIndex / 10) * 10, noOfElements, ...data.items)
				);
				setTotalCount(data.total_count);
				setError(null);
			})
			.catch((e) => setError(e.message));
	}

	function handleChange(e) {
		setSearchQuery(e.target.value);
		makeFetch(e.target.value);
	}

	return (
		<div style={{ height: "80vh" }}>
			<input
				type="text"
				value={searchQuery}
				placeholder="search ... "
				onChange={handleChange}
			></input>
			<h2>{error}</h2>
			<h2>{Math.min(totalCount, 1000)}</h2>
			<AutoSizer>
				{({ height, width }) => (
					<InfiniteLoader
						isItemLoaded={isItemLoaded}
						itemCount={Math.min(totalCount, 1000)}
						loadMoreItems={loadMoreItems}
						threshold={0}
					>
						{({ onItemsRendered, ref }) => (
							<List
								height={height}
								width={width}
								itemCount={Math.min(totalCount, 1000)}
								itemSize={100}
								itemData={repositories}
								onItemsRendered={onItemsRendered}
								ref={ref}
								page={page}
							>
								{Card}
							</List>
						)}
					</InfiniteLoader>
				)}
			</AutoSizer>
		</div>
	);
}

export default App;

/*

<AutoSizer>
				{({ width }) => (
					<FixedSizeList
						style={{ border: "2px solid black" }}
						onScroll={handleScroll}
						itemCount={Math.min(totalItems, 1000)}
						itemSize={100}
						height={600}
						width={width}
						useIsScrolling
					>
						{({ index, style, isScrolling }) => (
							<ListRow
								style={style}
								item={dataOnScreen[index]}
								index={index}
								isScrolling={isScrolling}
							></ListRow>
						)}
					</FixedSizeList>
				)}
			</AutoSizer>

*/
