import "./App.css";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import Card from "./Component/Card";
import {useEffect, useState } from "react";
import useSearch from "./utils/useSearch";

function App() {
	const [repositories, setRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	// const debouncedQuery = useDebounce('',200)
	const [page, setPage] = useState(0);
	const {searchResult,error,totalCount} = useSearch(searchQuery,page);

	// useEffect(() => {
	// 	console.log(repositories);
	// }, [repositories]);

	if (repositories.length === 0) {
		setRepositories(Array(1000).fill(null));
	}

	function isItemLoaded(index) {
		return index < repositories.length && repositories[index] !== null;
	}

	function loadMoreItems(startIndex, stopIndex) {
		setPage(Math.floor(startIndex / 10));
		console.log(Math.floor(startIndex/7));
		console.log(searchResult)
		setRepositories((prev) =>
			prev.toSpliced(startIndex, startIndex+10, ...searchResult)
		);
		// console.log(fetchPromise)
		// return fetchPromise;
	}

	function handleChange(e) {
		setSearchQuery(e.target.value);
	}

	return (
		<>
			<input
				type="text"
				value={searchQuery}
				placeholder="search ... "
				onChange={handleChange}
			></input>
			<h2>{error}</h2>
			<h2>{Math.min(totalCount, 1000)}</h2>
			<AutoSizer>
				{({ width }) => (
					<InfiniteLoader
						isItemLoaded={isItemLoaded}
						itemCount={Math.min(totalCount, 1000)}
						loadMoreItems={loadMoreItems}
					>
						{({ onItemsRendered, ref }) => (
							<List
								height={600}
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
		</>
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
