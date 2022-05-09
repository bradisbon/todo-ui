import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIError, LoadingHandler, SuccessHandler, ErrorHandler } from '../queries';

export function useRegister({onLoading, onSuccess, onError}: {onLoading?:LoadingHandler, onSuccess?: SuccessHandler<null>, onError?: ErrorHandler}) {
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({error: "", message: "", code: null})
		const [message, setMessage] = useState("")

		function register(email: string, password: string) {
				setIsLoading(true)
				if (onLoading) onLoading()
				const formData = new FormData()
				formData.append('email',email)
				formData.append('password',password)
				const response = fetch('https://todo.bradisbon.com/register',{
						method: 'POST',
						body: formData
				})

				response.then(r => {
						if (r.ok) {
								r.json().then(t => {
										setIsLoading(false)
										setMessage(t)
										setIsSuccess(true)
										if (onSuccess) onSuccess(null)
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
				register,
				isLoading,
				isSuccess,
				isError,
				error,
				message
		}
}

export default function Register() {
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const registeredRedirect = useCallback(() => {
			navigate('/login', {replace: true})
	},[navigate])

	const {register, error} = useRegister({onSuccess: registeredRedirect})

	return (

				<div className="min-h-screen flex flex-col justify-center">
						<div className="border-2 border-black shadow-bold container rounded-lg bg-blue-500 shadow-lg max-w-sm mx-auto p-4">
								<div className="divide-y divide-black">
										<div className="text-2xl pb-5 font-medium">
												Register
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
																<label className="font-medium" htmlFor="password">Password</label>
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
														onClick={() => register(email,password)}
												>Register</button>
										</div>
								</div>
						</div>
				</div>
		)

}
