import { useEffect, useState } from "react";
import "./App.css";
import useSearch from "./utils/useSearch";
import { FixedSizeList } from "react-window";
import ListRow from "./ListRow";
import useDebounce from "./utils/useDebounce";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pageToLoad, setPageToLoad] = useState(1);
	const { repositories, loading, error, hasNext, totalItems } = useSearch(searchQuery, page);
	// const { repositories, loading, error, hasNext, totalItems } = useSearch(searchQuery, page);
	const debouncedPageNumber = useDebounce(pageToLoad, 100);
	const [dataOnScreen, setDataOnScreen] = useState(Array(1000).fill(0));
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		setPage(debouncedPageNumber);
	}, [debouncedPageNumber]);

	useEffect(() => {
		setDataOnScreen((prev) => prev.toSpliced((pageToLoad - 1) * 10, 10, ...repositories));
		console.log(repositories);
	}, [repositories]);

	function handleChange(e) {
		setSearchQuery(e.target.value);
	}

	function handleScroll(e) {
		setPageToLoad(Math.ceil((Math.ceil(e.scrollOffset / 100) + 5) / 10));
		setCurrentIndex(Math.floor(e.scrollOffset / 200) + 0);
	}

	return (
		<>
			{/* Searchbar to search query */}
			<input type="text" placeholder="search ... " onChange={handleChange}></input>
			{/* diplay are to show result information after fecthing */}
			{/* area to how list length */}
			<h2>
				Total : {totalItems} &nbsp;&nbsp;&nbsp; Current {repositories.length}
			</h2>
			{/* area to show list contents */}
			{/* <h2>{loading && "Loading ... "}</h2> */}
			<h2>{error}</h2>
			<div className="display">
				<FixedSizeList
					onScroll={handleScroll}
					itemCount={Math.min(totalItems, 1000)}
					itemSize={100}
					height={600}
					width={"100%"}
					overscanCount={10}
					useIsScrolling
				>
					{({ index, style, isScrolling, loading }) => (
						<ListRow
							style={style}
							item={dataOnScreen[index]}
							isScrolling={isScrolling}
							loading={loading}
							index={index}
						></ListRow>
					)}
				</FixedSizeList>
			</div>
		</>
	);
}

export default App;
