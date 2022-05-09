import { APIError } from '../queries';
import Loader from '../../layout/Loader';
import { Navigate, useLocation } from 'react-router-dom';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
		token: string;
		authenticated: boolean;
}

interface Auth {
		user: User;
		loading: boolean;
		setUser: React.Dispatch<React.SetStateAction<{
				token: string;
				authenticated: boolean;
		}>>
		headers: {
				Authorization: string,
				'Cache-Control': string
		}
}

const authContext = createContext<Auth>(undefined!)

export function useAuth() {
	const auth = useContext(authContext)

	if (!auth) {
		throw new Error("useAuth must be used within ProvideAuth")
	}

	return auth
}

export default function ProvideAuth({children}:{children: any}) {
		const [user, setUser] = useState({token:"", authenticated: false})
		const [loading, setLoading] = useState(true)

		useEffect(() => {
				const storedToken = localStorage.getItem('token')
				if (storedToken) {
						setUser({token:storedToken, authenticated:true})
				}
				setLoading(false)
				},
		[])

		useEffect(() => {
				if (user.authenticated) {
						localStorage.setItem('token',user.token)
				}
				},[user.token, user.authenticated])

		const headers = useMemo(() => {
				return {
						Authorization: `Bearer ${user.token}`,
						'Cache-Control': 'no-cache'
				}
				},[user.token])

		const auth = {user, setUser, loading, headers}

		return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export function useSignOut() {
		const {setUser} = useAuth()

		function signOut() {
				setUser({token: "", authenticated: false})
		}

		return useCallback(signOut,[setUser])
}

export function useRedirectOn401() {
		const signOut = useSignOut()
		const navigate = useNavigate()

		return useCallback((error:APIError) => {
				if (error.code === 401) {
						signOut()
						navigate('/login')
				}
		},[signOut, navigate])
}

export function PrivateRoute({children}:{children:any}) {
		const auth = useAuth()
		const location = useLocation()

		if (auth.loading) return <Loader/>

		else if (!auth.user.authenticated) {
				console.log('auth:',JSON.stringify(auth))
				console.log(': (')
				console.log("not authenticated")
				return <Navigate to="/login" state={{ from: location }} replace />
		}

		return children
}
