import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Card from "./Card";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCallback, useEffect, useState } from "react";

export function List({ totalCount, data, setData, searchQuery, noOfFetchItems = 100 }) {
	const [page, setPage] = useState(1);

	function loadMoreItems(startIndex, stopIndex) {
		const pageCalculated = (startIndex - (startIndex % 100)) / 100 + 1;
		setPage(pageCalculated);

		const urls = [
			`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${pageCalculated}`,
		];

		if (page !== pageCalculated && !data[(pageCalculated - 1) * 100]) {
			if (startIndex % 100 > 93) {
				console.log("add another url");
				urls.push(
					`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${
						pageCalculated + 1
					}`
				);
			}
			return Promise.all(
				urls.map((url) =>
					fetch(url, {
						headers: {
							Authorization: `Bearer ${process.env.REACT_APP_GITHUB_KEY}`,
						},
					})
						.then((res) => res.json())
						.then((value) => value.items)
				)
			).then((fetchVals) => {
				const flatValues = fetchVals.flat();
				setData((prev) =>
					prev.toSpliced((pageCalculated - 1) * 100, flatValues.length, ...flatValues)
				);
			});
		}
	}

	return (
		<div style={{ height: "85vh", border: "1px solid black" }}>
			<AutoSizer>
				{({ height, width }) => (
					<InfiniteLoader
						isItemLoaded={(index) => !!data[index]}
						itemCount={totalCount}
						loadMoreItems={loadMoreItems}
						threshold={0}
						minimumBatchSize={100}
					>
						{({ onItemsRendered, ref }) => (
							<FixedSizeList
								height={height}
								width={width}
								itemCount={totalCount}
								itemSize={100}
								itemData={data}
								onItemsRendered={onItemsRendered}
								ref={ref}
							>
								{Card}
							</FixedSizeList>
						)}
					</InfiniteLoader>
				)}
			</AutoSizer>
		</div>
	);
}

// if (startIndex % 100 >= 90 && data[Math.ceil(stopIndex / 100) - 1]) {
// 	// console.log(
// 	// 	"make two calls now for : ",
// 	// 	Math.ceil(stopIndex / 100) - 1,
// 	// 	" and ",
// 	// 	Math.ceil(stopIndex / 100)
// 	// );
// }

/*

0-99 -> 1
100 - 199 -> 2
200 - 299 -> 3
300 - 399 -> 4
400 - 499 -> 5
500 - 599 -> 6
600 - 699 -> 
*/
