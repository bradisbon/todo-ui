import { List, useList, useDeleteList, useUpdateList } from "./listQueries"
import { useTodos, Todo, useCreateTodo, useUpdateTodo, useDeleteTodo } from "./todoQueries"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRedirectOn401 } from "./auth/auth"

function DeleteListButton({listID}:{listID:number}) {
		const navigate = useNavigate()
		const { deleteList } = useDeleteList({onSuccess:(data:number) => navigate('/')})

		return <button onClick={() => {deleteList(listID)}}>Delete</button>
}

function TodoLI({todo, updateTodo, deleteTodo}:{todo:Todo, updateTodo: (todo:Todo) => void, deleteTodo: (listID: number, todoID: number) => void}) {
		const [todoItem, setTodoItem] = useState<Todo>(todo)
		const descriptionEl = useRef<HTMLDivElement>(null)  // the only way to use contenteditable elements with react

		useEffect(() => {
				setTodoItem(todo)
		},[todo])

		function check() {
				const todo = {...todoItem, checked: !todoItem.checked}
				setTodoItem(todo)
				updateTodo(todo)
		}

		function handleInput(e: React.FormEvent<HTMLDivElement>) {
				const description = descriptionEl.current
				if (description) {
						const todo = {...todoItem,description:description.textContent || ''}
						setTodoItem(todo)
						updateTodo(todo)
				}
		}

		function handleEnter(e: React.KeyboardEvent<HTMLDivElement>) {
				if (e.key==="Enter") {
						e.currentTarget.blur()
				}
		}

		return (
				<li className="flex group justify-between">
						<input
								className="border-black accent-rose-400 w-5"
								type="checkbox"
								checked={todoItem.checked}
								onChange={check}
						/>
						<div
								contentEditable
								className="bg-red-200 border-black group-hover:border-2 group-hover:bg-white focus:border-2 focus:bg-white flex-auto p-1 ml-2 mr-2"
								onBlur={handleInput}
								onKeyPress={handleEnter}
								ref={descriptionEl}
								suppressContentEditableWarning={true}
						>
								{todoItem.description}
						</div>
								<img alt="" className="delete-icon invisible group-hover:visible" onClick={() => deleteTodo(todoItem.listID, todoItem.id)} src="/images/icons/trashcan.svg"/>
				</li>

		)
}

function ListDescription({description, onChange}:{description:string, onChange: (description:string) => void}) {
		const el = useRef<HTMLDivElement>(null)

		function handleBlur(e: React.FormEvent<HTMLDivElement>) {
				if (el.current) {
						const desc = el.current.innerText
						onChange(desc)
				}
		}

		function handleEnter(e: React.KeyboardEvent<HTMLDivElement>) {
				if (e.key==="Enter") {
						e.currentTarget.blur()
				}
		}

		return (
				<div
						contentEditable
						className="bg-red-200 font-bold hover:border-2 hover:bg-white focus:border-2 focus:bg-white border-black p-1 rounded-sm min-w-full"
						onBlur={handleBlur}
						ref={el}
						onInput={e => e.currentTarget.innerText}
						onKeyPress={handleEnter}
						suppressContentEditableWarning={true}
				>
						{description}
				</div>
		)
}

export default function ListDiv() {
		const [title, setTitle] = useState('Add Title')
		const [description, setDescription] = useState('Add Description')
		const [todoItems, setTodoItems] = useState<Todo[]>([])

		const params = useParams()
		let listID = 0
		if (typeof params.listID != 'undefined') {
				listID = parseInt(params.listID)
		} 

		const setList = useCallback((list:List) => {
				setTitle(list.title ? list.title : 'Add Title')
				setDescription(list.description ? list.description : 'Add Description')
		}, [])

		const removeTodo = useCallback((todoID:number) => {
				setTodoItems(todoItems => todoItems.filter(todoItem => todoItem.id !== todoID))
		},[])

		const insertTodo = useCallback(function(todo:Todo) {
				setTodoItems(todoItems => [todo,...todoItems])
		},[])

		const unauthRedirect = useRedirectOn401()

		useTodos({listID, onSuccess: setTodoItems, onError: unauthRedirect})
		const { list } = useList({listID, onSuccess: setList, onError: unauthRedirect})
		const { updateList } = useUpdateList({onError: unauthRedirect}) // no onSuccess needed since title and description will already be updated in onInput
		const { createTodo } = useCreateTodo({listID, onSuccess: insertTodo, onError: unauthRedirect})
		const { deleteTodo } = useDeleteTodo({onSuccess: removeTodo, onError: unauthRedirect})
		const { updateTodo } = useUpdateTodo({onError: unauthRedirect})

		function updateDescription(description: string) {
				setDescription(description)
				updateList({id:listID, owner_id:list.owner_id, title, description})
		}

		return (
				<div className="">
						<div className="py-16 lg:px-72 md:px-36 sm:px-16 px-8">
								<div className="bg-red-200 border-black border-4 shadow-bold p-5 rounded-lg">
										<div className="flex justify-end">
												<DeleteListButton
														listID={listID}
												/>
										</div>
										<div className="p-1">
												<span className="flex font-bold group hover:bg-slate-200 rounded-md text-2xl">
														<input
																className="bg-red-200 font-bold hover:border-2 hover:bg-white focus:border-2 focus:bg-white border-black p-1 rounded-sm min-w-full"
																value={title}
																onInput={e => {if (e.currentTarget.value.length < 72) setTitle(e.currentTarget.value)}}
																onBlur={() => updateList({id:listID, owner_id:list.owner_id, title, description})}
														/>
												</span>
										</div>
										<div className="p-1">
												<span className="flex focus:outline-none group hover:bg-slate-200 rounded-md" >
														<ListDescription
																description={description}
																onChange={updateDescription}
														/>
												</span>
										</div>
										<div className="flex" onClick={() => createTodo()}>
												<img alt="" className="hover:bg-slate-200 hover:rounded-lg" src="/images/icons/plus.svg" width={30}/>
										</div>		
										<div className="p-1">
												<div className="p-1">
														<ul>
																{Array.from(todoItems).sort((a,b) => a.id > b.id ? 1 : -1).map(todo => (
																		<TodoLI
																				key={todo.id}
																				updateTodo={updateTodo}
																				deleteTodo={deleteTodo}
																				todo={todo}
																		/>
																))}
														</ul>
												</div>
										</div>
								</div>
						</div>
				</div>
		)
}
