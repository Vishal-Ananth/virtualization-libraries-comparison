import "./App.css";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import Card from "./Component/Card";
import { useEffect, useState } from "react";
import useSearch from "./utils/useSearch";
import useDebounce from "./utils/useDebounce";

function App() {
	const [repositories, setRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedQuery = useDebounce(searchQuery, 500);
	const [page, setPage] = useState(0);
	const { searchResult, error, totalCount } = useSearch(debouncedQuery, page);

	useEffect(() => {
		console.log(repositories);
	}, [repositories]);

	if (repositories.length === 0) {
		setRepositories(Array(1000).fill(null));
	}

	function isItemLoaded(index) {
		return index < repositories.length && repositories[index] !== null;
	}

	function loadMoreItems(startIndex, stopIndex) {
		setPage(Math.floor(startIndex / 10));
		console.log(startIndex, stopIndex);
		setRepositories((prev) => prev.toSpliced(startIndex, stopIndex + 1, ...searchResult));
	}

	function handleChange(e) {
		setSearchQuery(e.target.value);
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
