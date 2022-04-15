import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
	token: string;
	authenticated: boolean;
}

const todosContext = createContext()

export function useTodos() {
	return useContext(todosContext)

}

export default function ProvideTodos({children}:{children: any}) {
	const todos = useProvideTodos()
	return <todosContext.Provider value={todos}>{children}</todosContext.Provider>
}

function validateToken(tokenValue: string) {
	if (tokenValue.length) return true
	else return false
}

type Response<Type> = {
	isSuccess: boolean;
	isLoading: boolean;
	data: null | Type
}

function useResponse() {
	const [response, setResponse] = useState({isSuccess:false,isLoading:true,data:null})
	return [response, setResponse]
}

function useProvideTodos() {
	const [user, setUser] = useState<User>({token:"", authenticated: false})

	// store token in a cookie or local storage
	async function storeToken(tokenValue: string) {}

	// delete token from cookies or local storage
	async function deleteToken() {}

	// load token from cookies or local storage
	async function loadTokenValue() {}

	function updateToken(tokenValue: string) {
	}

	function invalidateToken() {
		deleteToken()
		setUser(token => {
		token.token = ""
		token.authenticated = false
		return token
				})
	}

	async function fetchToken(email: string, password: string) {
		return ""
	}

	async function signIn(email: string, password: string): Response<string> {
		const [response, setResponse] = useResponse()

		const token = await fetchToken(email, password)

		if (validateToken(token)) {
			await storeToken(token)

			setUser(user => {
				user.token = token
				user.authenticated = true
				return user
				})


		} 

		return response
	}

	function signUp(email: string, password: string) {}

	function signOut() {
		invalidateToken()
	}

	function useLists() {}

	function useTodos(listID: string) {}

	function createList(title: string, description: string) {}

	function createTodo(listID: string, description: string, checked: boolean) {}
	
	function updateList(listID: string, title: string, description: string) {}

	function updateTodo(listID: string, todoID: string, description: string, checked: boolean) {}

	function deleteList(listID: string) {}

	function deleteTodo(todoID: string) {}

	return {
		signIn,
		signUp,
		signOut,
		useLists,
		useTodos,
		createList,
		createTodo,
		updateList,
		updateTodo,
		deleteList,
		deleteTodo
	}
}
