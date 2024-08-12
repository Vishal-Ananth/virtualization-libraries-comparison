import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Card from "./Card";
import AutoSizer from "react-virtualized-auto-sizer";
import {useState } from "react";

export default function List({ totalCount, data, setData, searchQuery, noOfFetchItems = 100 }) {
	const [page, setPage] = useState(1); // state to store the current page to be fetched

	// function that gets called everytime InfiniteLoader
	function loadMoreItems(startIndex) {
		const pageCalculated = (startIndex - (startIndex % noOfFetchItems)) / noOfFetchItems + 1; // ex : startIndex = 356 => performing (300 - 56)/100 => 3 then 3 +1 to get page value of 4
		setPage(pageCalculated); 

		// Array fo urls as multiple fetches might be requeried based on conditions
		const urls = [
			`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${pageCalculated}`,
		];

		if (page !== pageCalculated && !data[(pageCalculated - 1) * noOfFetchItems]) {
			// Checking if there are two pages that need to be fetched and displayed
			if (startIndex % noOfFetchItems > 93) { // ( condition > "value exiting the screen on scroll") change value as per viewport height
				// console.log("add another url");
				urls.push(
					`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${noOfFetchItems}&page=${
						pageCalculated + 1
					}`
				);
			}

			// Make all fetch calls in urls array to give a singular array with all results
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
				const flatValues = fetchVals.flat(1); // .flat() to get rid of all the sub arrays and return an array of depth 1
				setData((prev) =>
					prev.toSpliced((pageCalculated - 1) * 100, flatValues.length, ...flatValues) // replacing fetchValue.length number of null values from specified index with the elements of the flatValues array
				);
			});
		}
	}

	return (
		<div style={{ height: "85vh", border: "1px solid black" }}>
			{/* AutoSizer component to handle width and height automaticaly to make list responsive */}
			<AutoSizer>
				{({ height, width }) => (
					<InfiniteLoader 
						isItemLoaded={(index) => !!data[index]} // determines if item in the array is holding a value or not, required to call the loadMoreItems function
						itemCount={totalCount} // use 1000 for demo , totalCount for production
						loadMoreItems={loadMoreItems} // function called when a item that is not loaded in encountered in the viewport
						threshold={0} // ensuring there are no pre-fetched value on first render
						minimumBatchSize={noOfFetchItems} // The size of each batch of items that are to be fetched and added to the array/list
					>
						{({ onItemsRendered, ref }) => (
							<FixedSizeList 
								height={height} // provided by autosizer - takes the height relative to autosizers parent
								width={width} // provided by autosizer - takes the width relative to autosizers parent
								itemCount={totalCount} // use 1000 for demo , totalCount for production
								itemSize={100} // height of a lingle list item in px
								itemData={data} // The array/list of items that need to be virtualized
								onItemsRendered={onItemsRendered} 
								ref={ref} // ref used by infinite loader to manipulate element for infinite loading
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
