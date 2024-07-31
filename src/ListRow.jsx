export default function ListRow({ item, style, isScrolling, loading, index }) {
	return (
		<>
			{loading ? (
				<h3 style={style} className="card">
					Loading...
				</h3>
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
