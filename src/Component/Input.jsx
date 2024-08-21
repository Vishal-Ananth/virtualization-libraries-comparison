export default function Input({ setSearchQuery }) {
	return (
		<input
			id="search-input"
			type="text"
			placeholder="search ... "
			onChange={(e) => setSearchQuery(e.target.value)}
		></input>
	);
}
