import { Outlet } from 'react-router-dom';


export function Layout() {
		return (
				<div className="bg-red-400 font-mono min-h-screen">
						<Outlet/>
				</div>
		)
}
