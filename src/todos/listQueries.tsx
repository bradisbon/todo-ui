import { APIError, LoadingHandler, SuccessHandler, ErrorHandler } from './queries';
import { useEffect, useState } from 'react';
import { useAuth } from './auth/auth';

export interface List {
		id: number;
		owner_id: number;
		title: string;
		description: string
}

export function useLists({onLoading, onSuccess, onError}: {onLoading?:LoadingHandler, onSuccess?:SuccessHandler<List[]>, onError?:ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})
		const [lists, setLists] = useState<List[]>([])

		useEffect(() => {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch('https://todo.bradisbon.com/lists',
									{headers})
								.then(r => {
										if (r.ok) {
												r.json().then(l => {
														setLists(l)
														setIsSuccess(true)
														if (onSuccess) onSuccess(l)
												})
										} else {
												r.json().then((e:APIError) => {
														const error = {error: e.error, message: e.message, code: r.status}
														setError(error)
														setIsError(true)
														if (onError) onError(error)
												}).catch(() => {
														r.text().then(t => {
																const error = {error: "", message: t, code: r.status}
																setError(error)
																setIsError(true)
																if (onError) onError(error)
														})
												})
										}
						}).catch(() => {
								const error = {error: "Connection error", message: "request failed", code: null}
								setError(error)
								setIsError(true)
								if (onError) onError(error)
						})
						setIsLoading(false)
				}
		},[user.authenticated, headers, onLoading, onSuccess, onError])

		return {
				lists,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

export function useList({listID, onLoading, onSuccess, onError}:{listID:number, onLoading?: LoadingHandler, onSuccess?: SuccessHandler<List>, onError?: ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})
		const [list, setList] = useState<List>({id: 0, owner_id: 0, title: "", description: "", })

		useEffect(() => {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${listID}`,
									{headers})
								.then(r => {
										if (r.ok) {
												r.json().then(l => {
														setList(l)
														setIsSuccess(true)
														if (onSuccess) onSuccess(l)
												})
										} else {
												r.json().then((e:APIError) => {
														const error = {error: e.error, message: e.message, code: r.status}
														setError(error)
														setIsError(true)
														if (onError) onError(error)
												}).catch(() => {
														r.text().then(t => {
																const error = {error: "", message: t, code: r.status}
																setError(error)
																setIsError(true)
																if (onError) onError(error)
														})
												})
										}
						}).catch(() => {
								const error = {error: "Connection error", message: "request failed", code: null}
								setError(error)
								setIsError(true)
								if (onError) onError(error)
						})
						setIsLoading(false)
				}
		},[user.authenticated, headers, listID, onSuccess, onLoading, onError])

		return {
				list,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

export function useDeleteList({onLoading, onSuccess, onError}: {onLoading?: LoadingHandler, onSuccess?: SuccessHandler<number>, onError?: ErrorHandler}) {
		const { user, headers } = useAuth()

		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})

		function deleteList(listID:number) {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${listID}`,
									{
								headers,
								method:'DELETE'
						})
								.then(r => {
										if (r.ok) {
												setIsSuccess(true)
												if (onSuccess) onSuccess(listID)
										} else {
												r.json().then((e:APIError) => {
														const error = {error: e.error, message: e.message, code: r.status}
														setError(error)
														setIsError(true)
														if (onError) onError(error)
												}).catch(() => {
														r.text().then(t => {
																const error = {error: "", message: t, code: r.status}
																setError(error)
																setIsError(true)
																if (onError) onError(error)
														})
												})
										}
						}).catch(() => {
								const error = {error: "Connection error", message: "request failed", code: null}
								setError(error)
								setIsError(true)
								if (onError) onError(error)
						})
						setIsLoading(false)
				}
		}

		return {
				deleteList,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

export function useCreateList({onLoading, onSuccess, onError}: {onLoading?: LoadingHandler, onSuccess?: SuccessHandler<List>, onError?: ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})
		const [list, setList] = useState<List>({id: 0, owner_id: 0, title: "", description: "", })

		function createList(title = '', description = '') {

				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/`,
									{
								headers,
								method:'POST',
								body: JSON.stringify({title, description})
						})
								.then(r => {
										if (r.ok) {
												r.json().then(l => {
														setList(l)
														setIsSuccess(true)
														if (onSuccess) onSuccess(l)
												})
										} else {
												r.json().then((e:APIError) => {
														const error = {error: e.error, message: e.message, code: r.status}
														setError(error)
														setIsError(true)
														if (onError) onError(error)
												}).catch(() => {
														r.text().then(t => {
																const error = {error: "", message: t, code: r.status}
																setError(error)
																setIsError(true)
																if (onError) onError(error)
														})
												})
										}
						}).catch(() => {
								const error = {error: "Connection error", message: "request failed", code: null}
								setError(error)
								setIsError(true)
								if (onError) onError(error)
						})
						setIsLoading(false)
				}
		}

		return {
				createList,
				isLoading,
				isSuccess,
				isError,
				list,
				error
		}
}

export function useUpdateList({onLoading, onSuccess, onError}: {onLoading?: LoadingHandler, onSuccess?: SuccessHandler<List>, onError?: ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})

		function updateList(list: List) {

				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${list.id}`,
									{
								headers,
								method:'PUT',
								body: JSON.stringify(list)
						})
								.then(r => {
										if (r.ok) {
												r.json().then(l => {
														setIsSuccess(true)
														if (onSuccess) onSuccess(l)
												})
										} else {
												r.json().then((e:APIError) => {
														const error = {error: e.error, message: e.message, code: r.status}
														setError(error)
														setIsError(true)
														if (onError) onError(error)
												}).catch(() => {
														r.text().then(t => {
																const error = {error: "", message: t, code: r.status}
																setError(error)
																setIsError(true)
																if (onError) onError(error)
														})
												})
										}
						}).catch(() => {
								const error = {error: "Connection error", message: "request failed", code: null}
								setError(error)
								setIsError(true)
								if (onError) onError(error)
						})
						setIsLoading(false)
				}
		}

		return {
				updateList,
				isLoading,
				isSuccess,
				isError,
				error
		}
}
