import { APIError, LoadingHandler, SuccessHandler, ErrorHandler } from './queries';
import { useEffect, useState } from 'react';
import { useAuth } from './auth/auth';

export interface Todo {
		id: number;
		listID: number;
		description: string;
		checked: boolean;
}

export function useTodos({listID, onLoading, onSuccess, onError}:{listID:number, onLoading?:LoadingHandler, onSuccess?:SuccessHandler<Todo[]>, onError?:ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})
		const [todos, setTodos] = useState<Todo[]>([])

		useEffect(() => {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${listID}/todos`,
									{headers})
								.then(r => {
										if (r.ok) {
												r.json().then(l => {
														setTodos(l)
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
		},[user.authenticated, headers, listID, onLoading, onSuccess, onError])

		return {
				todos,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

export function useCreateTodo({listID, onLoading, onSuccess, onError}:{listID:number, onLoading?:LoadingHandler, onSuccess?:SuccessHandler<Todo>, onError?:ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})
		const [todo, setTodo] = useState<Todo>({id: 0, listID, description: "", checked: false})

		function createTodo(description = '', checked = false) {

				if (user.authenticated) {
						setIsSuccess(false)
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${listID}/todos`,
									{
								headers,
								method:'POST',
								body: JSON.stringify({description, checked})
						})
								.then(r => {
										if (r.ok) {
												r.json().then(t => {
														setTodo(t)
														setIsSuccess(true)
														if (onSuccess) onSuccess(t)
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

						return todo
				}
		}

		return {
				createTodo,
				isLoading,
				isSuccess,
				isError,
				todo,
				error
		}
}

export function useUpdateTodo({onLoading, onSuccess, onError}:{onLoading?:LoadingHandler, onSuccess?:SuccessHandler<Todo[]>, onError?:ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})

		function updateTodo(todo:Todo) {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${todo.listID}/todos/${todo.id}`,
									{
								headers,
								method:'PUT',
								body: JSON.stringify(todo)
						})
								.then(r => {
										if (r.ok) {
												r.json().then(t => {
														setIsSuccess(true)
														if (onSuccess) onSuccess(t)
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

						return todo
				}
		}

		return {
				updateTodo,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

export function useDeleteTodo({onLoading, onSuccess, onError}:{onLoading?:LoadingHandler, onSuccess?:SuccessHandler<number>, onError?:ErrorHandler}) {
		const { user, headers } = useAuth()
		const [isLoading, setIsLoading] = useState(false)
		const [isSuccess, setIsSuccess] = useState(false)
		const [isError, setIsError] = useState(false)
		const [error, setError] = useState<APIError>({code: null, error: "", message: ""})

		function deleteTodo(listID:number, todoID: number) {
				if (user.authenticated) {
						setIsLoading(true)
						if (onLoading) onLoading()
						fetch(`https://todo.bradisbon.com/lists/${listID}/todos/${todoID}`,
									{
								headers,
								method:'DELETE'
						})
								.then(r => {
										if (r.ok) {
												setIsSuccess(true)
												if (onSuccess) onSuccess(todoID)
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

						return todoID
				}
		}

		return {
				deleteTodo,
				isLoading,
				isSuccess,
				isError,
				error
		}
}

