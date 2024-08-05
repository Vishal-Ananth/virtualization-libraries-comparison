export default function Card({ index, style, data, page }) {
	const loading = data[index] == null;

	return (
		<>
			{!loading ? (
				<div style={style} className="card">
					<p>{page}</p>
					<h2>{index}</h2>
					<p>{data[index].full_name}</p>
				</div>
			) : (
				<div style={style} className="card">
					<h2>{index}</h2>
					<h2>Loading value ....</h2>
				</div>
			)}
		</>
	);
}
