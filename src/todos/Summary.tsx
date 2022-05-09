import { useNavigate } from "react-router-dom";
import { List } from "./listQueries";


export default function Summary({list}:{list:List}) {
		const navigate = useNavigate()
		return (
				<div className="border-4 border-black bg-red-300 hover:bg-red-500 shadow-bold" onClick={() => navigate(`/lists/${list.id}`)}>
						<div className="font-bold pl-3 pt-2">{list.title ? list.title : "Untitled"}</div>
						<div className="font-light pb-3 pl-3 pt-1">{list.description}</div>
				</div>
		)
}
