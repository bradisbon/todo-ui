import { Fragment, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useRedirectOn401 } from "./auth/auth"
import { List, useCreateList, useLists } from "./listQueries"
import Summary from './Summary'

function ListLI({list}:{list:List}) {
		return <div><Summary list={list}/></div>
}

function ListsBody({isSuccess, lists}:{lists: List[], isSuccess: boolean, error: string}) {
		return isSuccess ? (
				<div>
						{isSuccess && lists.length === 0 ? (
								<div>
										You don't have any lists created.
								</div>
						) : <div></div>}
						<div className="flex flex-col gap-8 justify-between min-h-0">{lists.map(list => <ListLI key={list.id} list={list}/>)}</div>
				</div>
		) : <div></div>
}

function ListsError({isError, error}:{isError: boolean, error: string}) {
		return isError ? <div>Error: {error}</div> : <div></div>
}

function Loader({isLoading, children}:{isLoading:boolean, children?:any}) {
		return isLoading ? <div>Loading...</div> : <Fragment>{children}</Fragment>
}

export default function Lists() {
		const navigate = useNavigate()
		const redirectOn401 = useRedirectOn401()

		const navigateToList = useCallback((list:List) => {
				navigate(`/lists/${list.id}`)
		},[navigate])

		const lists = useLists({onError: redirectOn401})
		const { createList } = useCreateList({onSuccess: navigateToList, onError: redirectOn401})

		return (
				<div className="px-20 py-10 ">
						<div className="flex justify-between">
								<div className="font-bold text-2xl">LISTS</div>
								<img alt="" className="hover:bg-slate-200 hover:rounded-lg" width={50} onClick={() => createList()} src="/images/icons/plus.svg"/>
						</div>
						<div className="py-10" id="lists-container">
								<Loader isLoading={lists.isLoading}>
										<ListsError
												isError={lists.isError}
												error={lists.error.error}
										/>
										<ListsBody
										isSuccess={lists.isSuccess}
										lists={lists.lists}
										error={lists.error.error}
										/>
								</Loader>
						</div>
				</div>
		)
}
