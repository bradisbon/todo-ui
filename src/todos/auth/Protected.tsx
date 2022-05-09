import { Outlet } from 'react-router-dom';
import { PrivateRoute } from './auth';
import { Nav } from '../../layout/Nav';


export function Protected() {
		return (
				<PrivateRoute>
						<Nav/>
						<Outlet/>
				</PrivateRoute>
		)
}
