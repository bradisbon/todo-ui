import { useCallback, useState } from 'react'
import { useAuth, User } from './auth'
import { APIError, ErrorHandler, LoadingHandler, SuccessHandler } from '../queries';
import { useNavigate } from 'react-router-dom';

export function useSignIn({onLoading, onSuccess, onError}: {onLoading?:LoadingHandler, onSuccess?: SuccessHandler<User>, onError?: ErrorHandler}) {
	const {setUser, user} = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [isError, setIsError] = useState(false)
	const [error, setError] = useState<APIError>({error: "", message: "", code: null})
	const [message, setMessage] = useState("")

	function signIn(email: string, password: string) {
		setIsLoading(true)
		if (onLoading) onLoading()
		const formData = new FormData()
		formData.append('email',email)
		formData.append('password',password)
		const response = fetch('https://todo.bradisbon.com/login',{
			method: 'POST',
			body: formData
		})

		response.then(r => {
				if (r.ok) {
					r.json().then(t => {
						setUser({token:t.token,authenticated:true})
						setIsLoading(false)
						setMessage(t)
						setIsSuccess(true)
						if (onSuccess) onSuccess({token: t, authenticated: true})
						}).catch((e:SyntaxError) => {
				const error = {error: e.name, message: e.message, code: null}
					setError(error)
					setIsError(true)
					if (onError) onError(error)
							})
					}
				else r.json().then(e => {
				const error = {error: e.name, message: e.message, code: null}
					setIsError(true)
					setError(error)
					if (onError) onError(error)
					}).catch((e:SyntaxError) => {
				const error = {error: e.name, message: e.message, code: null}
					setIsError(true)
					setError(error)
					if (onError) onError(error)
						})
			}).catch(e => {
				const error = {error: e.name, message: e.message, code: null}
				setIsError(true)
				setError(error)
				if (onError) onError(error)
			})
			setIsLoading(false)
	}

	return {
		user,
		signIn,
		isLoading,
		isSuccess,
		isError,
		error,
		message
	}
}


export default function Login() {
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSignedIn = useCallback((user:User) => {
			if (user.authenticated) {
					navigate('/', {replace: true})
			}
	},[navigate])

	const {signIn, error} = useSignIn({onSuccess: handleSignedIn})

	return (

				<div className="min-h-screen flex flex-col justify-center">
						<div className="border-2 border-black shadow-bold container  rounded-lg bg-blue-500 shadow-lg max-w-sm mx-auto p-4">
								<div className="divide-y divide-black">
										<div className="text-2xl pb-5 font-medium">
												Log in
										</div>
										<div className="flex flex-col">
												<div className="flex flex-col pt-5">
														<div className="flex">
																<label className="font-medium" htmlFor="email">Email</label>
																<label className="font-medium pl-2 text-red-500" htmlFor="email">{error.message}</label>
														</div>
														<input
																className="invalid:border-red-500 focus:invalid:border-red-500 focus:outline-none border-2 border-black mt-2 p-2 font-light rounded-lg"
																onInput={e => setEmail(e.currentTarget.value)}
																name="email"
																type="email"
														/>
												</div>
												<div className="flex flex-col pt-5">
														<div className="flex">
																<label className=" font-medium" htmlFor="password">Password</label>
																<label className="font-medium pl-2 text-red-500" htmlFor="password"></label>
														</div>
														<input
																className="border-2 border-black mt-2 p-2 font-light rounded-lg"
																name="password"
																onInput={e => setPassword(e.currentTarget.value)}
																type="password"
														/>
												</div>
												<button
														className="border-2 border-black hover:bg-rose-600 bg-rose-500 mt-5 py-2 font-light rounded-md text-white"
														onClick={() => signIn(email,password)}
												>
												Log in
												</button>
										</div>
								</div>
								<div className="flex justify-center">
										<a className="pt-2" href='/register'>Register</a>
								</div>
						</div>
				</div>
	       )

}
