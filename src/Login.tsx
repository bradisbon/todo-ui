export default function Login() {
	return (

        <div className="mt-32 rounded-xl bg-white shadow-lg max-w-sm mx-auto p-4">
            <div className="divide-y">
                <div className="text-2xl pb-5 font-medium">
                    Log in
                </div>
                <form className="flex flex-col" id="login-form" method="post" name="login">
                    <div className="flex flex-col pt-5">
						<div className="flex">
							<label className="font-medium" htmlFor="email">Email</label>
							<label className="font-medium pl-2 text-red-500" htmlFor="email" id="email-error"></label>
						</div>
                        <input className="invalid:border-red-500 focus:invalid:border-red-500 focus:outline-none border mt-2 p-2 font-light rounded-lg" id="email-input" name="email"  type="email"/> </div>
                    <div className="flex flex-col pt-5">
						<div className="flex">
							<label className="font-medium" htmlFor="password">Password</label>
							<label className="font-medium pl-2 text-red-500" htmlFor="password" id="password-error"></label>
						</div>
                        <input className="border mt-2 p-2 font-light rounded-lg" id="password-input" name="password" type="password"/>
                    </div>
                    <button className="hover:bg-blue-600 bg-blue-500 mt-5 py-2 font-light rounded-md drop-shadow-md text-white" id="login-btn" type="submit">Log in</button>
                </form>
            </div>
        </div>
	       )

}
