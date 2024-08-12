import { useEffect, useState } from "react";
import useFetch from "../utils/useFetch";
import List from "./List";

function App() {
	const [searchQuery, setSearchQuery] = useState(""); // text to search for
	const { data, loading, error, totalCount } = useFetch(searchQuery); // hook to make fetch calls for change in searchQuery value
	const [repo, setRepo] = useState([]); // common data structure to store all fetched result values to display

	// Reseting the repo array in between renders when searchQuery changes
	useEffect(() => {
		if (totalCount !== 0) {
			setRepo(new Array(totalCount).fill(null));
		}
	}, [totalCount]);

	// Replacing the first 'x' repo values with the fetched results on change in the data returned from the useFetch hook
	useEffect(() => {
		if (data.length !== 0) {
			setRepo((prev) => prev.toSpliced(0, 100, ...data));
		}
	}, [data]);

	return (
		<div>
			
			<input
				type="text"
				placeholder="search ... "
				onChange={(e) => setSearchQuery(e.target.value)}
			></input>
			<h1>{error}</h1>


			{searchQuery.length !== 0 && (
				<div className="data">
					<h2>Total Results :{totalCount}</h2>
					{loading}
					<List
						data={repo}
						setData={setRepo}
						totalCount={totalCount}
						searchQuery={searchQuery}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
