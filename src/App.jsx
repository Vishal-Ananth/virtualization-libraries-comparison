import "./App.css";
import { useEffect, useState } from "react";
import useFetch from "./utils/useFetch";
import { List } from "./list";

function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const { data, loading, error, totalCount } = useFetch(searchQuery);
	const [repo, setRepo] = useState([]);

	useEffect(() => {
		if (totalCount !== 0) {
			setRepo(new Array(totalCount).fill(null));
		}
	}, [totalCount]);

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
