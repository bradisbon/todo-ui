import { Link } from "react-router-dom"
import { useSignOut } from "../todos/auth/auth"

export function Nav() {
		const signOut = useSignOut()

		return (
				<span className="bg-blue-500 flex border-blue-500 border-b-black border-4 justify-between">
						<div className="font-extrabold text-4xl pl-10 pt-2 pb-2">
								<Link to="/">
								TODOGO
								</Link>
						</div>
						<div>
								<button className="pt-3 pr-4" onClick={signOut}>Sign Out</button>
						</div>
				</span>
		)
}
