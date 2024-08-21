export default function Card({ index, style, data }) {
	const loading = data[index] == null;

	return (
		<>
			{!loading ? (
				<div
					style={{ ...style, border: "1px solid green", paddingLeft: "5px" }}
					className="card"
				>
					<h2>{index}</h2>
					<p>{data[index].full_name}</p>
				</div>
			) : (
				<div
					style={{ ...style, border: "1px solid black", paddingLeft: "5px" }}
					className="card"
				>
					<h2>{index}</h2>
					<h2>Loading value ....</h2>
				</div>
			)}
		</>
	);
}
