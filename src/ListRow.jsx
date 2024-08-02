import { useEffect } from "react";

export default function ListRow({ item, style, index }) {
	useEffect(() => {
		console.log(item);
	}, [item]);
	return (
		<>
			{!item ? (
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
