import { useEffect, useState } from "react";
import useFetch from "../utils/useFetch";
import List from "./list";
import Input from "./Input";

function App() {
	const [searchQuery, setSearchQuery] = useState(""); // text to search for
	const { data, loading, error, totalCount } = useFetch(searchQuery); // hook to make fetch calls for change in searchQuery value
	const [repositories, setRepositories] = useState([]); // common data structure to store all fetched result values to display

	// Reseting the repo array in between renders when searchQuery changes
	useEffect(() => {
		if (totalCount !== 0) {
			setRepositories(new Array(totalCount).fill(null));
		}
	}, [totalCount]);

	// Replacing the first 'x' values in repositories  with data from the useFetch hook being called on change in searchQuery value
	useEffect(() => {
		if (data.length !== 0) {
			setRepositories((prev) => prev.toSpliced(0, 100, ...data));
		}
	}, [data]);

	return (
		<div>
			{/* <form onSubmit={(e) => e.preventDefault()}> */}
			<Input setSearchQuery={setSearchQuery} />
			{/* </form> */}
			<h1>{error}</h1>

			{searchQuery.length !== 0 && !error && (
				<div className="data">
					<h2>Total Results :{totalCount}</h2>
					{loading}
					<List
						data={repositories}
						setData={setRepositories}
						totalCount={totalCount}
						searchQuery={searchQuery}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
