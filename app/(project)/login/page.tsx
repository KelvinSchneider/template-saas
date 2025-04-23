import { handleAuth } from "@/app/actions/handle-auth"

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Login</h1>
            <form action={handleAuth}>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Signin with Google</button>
            </form>
        </div>
    );
}