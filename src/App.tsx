import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProvideAuth from './todos/auth/auth';
import { Layout } from './layout/Layout';
import ListDiv from './todos/List';
import Lists from './todos/Lists';
import Login from './todos/auth/Login'
import { Protected } from './todos/auth/Protected';
import Register from './todos/auth/Register'



function App() {
		return (
				<ProvideAuth>
						<BrowserRouter>
								<Routes>
										<Route element={<Layout/>}>
												<Route path='/register' element={<Register/>}/>
												<Route path="/login" element={<Login/>}/>
												<Route element={<Protected/>}>
														<Route path="/" element={<Lists/>}/>
														<Route path="/lists/:listID" element={<ListDiv/>}/>
												</Route>
										</Route>
								</Routes>
						</BrowserRouter>
				</ProvideAuth>
		);
}

export default App;
