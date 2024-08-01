export default function ListRow({ item, style, isScrolling, loading, index }) {
	return (
		<>
			{isScrolling ? (
				<div style={style} className="card">
					<h1>{index}</h1>
					<h3>Loading...</h3>
				</div>
			) : item === undefined ? (
				<div style={style} className="card">
					<h1>{index}</h1>
				</div>
			) : (
				<div style={style} className="card">
					<h1>{index}</h1>
					<div>{item.full_name}</div>
					<div>{item.id}</div>
				</div>
			)}
		</>
	);
}
