export interface APIError {
		code: null | number;
		error: string;
		message: string
}

export type LoadingHandler = () => void
export type SuccessHandler<Type> = (data:Type) => void
export type ErrorHandler = (error:APIError) => void
