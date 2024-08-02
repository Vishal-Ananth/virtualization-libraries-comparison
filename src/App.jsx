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
	const { repo1, repo2, errorOne, errorTwo, totalItems } = useSearch(searchQuery, page);
	const debouncedPageNumber = useDebounce(pageToLoad, 100);
	const [dataOnScreen, setDataOnScreen] = useState(Array(1000).fill(0));

	// useEffect(() => {
	// 	console.log(repo1);
	// 	console.log(repo2);
	// }, [dataOnScreen]);

	useEffect(() => {
		if (debouncedPageNumber > 0) {
			setPage(debouncedPageNumber);
		}
	}, [debouncedPageNumber]);

	useEffect(() => {
		if (repo1.length !== 0 && repo2.length !== 0) {
			if (pageToLoad !== 0) {
				setDataOnScreen((prev) =>
					prev.toSpliced((pageToLoad - 1) * 10, 20, ...repo1, ...repo2)
				);
			} else if (pageToLoad !== 100) {
				setDataOnScreen((prev) => prev.toSpliced(pageToLoad * 10, 20, ...repo1, ...repo2));
			}
		}
	}, [repo1]);

	function handleChange(e) {
		setSearchQuery(e.target.value);
	}

	function handleScroll(e) {
		const pageCalc = Math.ceil(Math.ceil(e.scrollOffset / 100) / 10);
		setPageToLoad(pageCalc);
	}

	return (
		<>
			{/* Searchbar to search query */}
			<input type="text" placeholder="search ... " onChange={handleChange}></input>
			{/* diplay are to show result information after fecthing */}
			{/* area to how list length */}
			<h2>Total : {totalItems}</h2>
			{/* area to show list contents */}
			{/* <h2>{loading && "Loading ... "}</h2> */}

			<h3>{errorTwo}</h3>
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
					{({ index, style, isScrolling }) => (
						<ListRow
							style={style}
							item={dataOnScreen[index]}
							index={index}
							isScrolling={isScrolling}
						></ListRow>
					)}
				</FixedSizeList>
			</div>
		</>
	);
}

export default App;
