import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function Dashboard() {
    // Estamos do lado do servidor
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    console.log(session);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>{session?.user?.email ? session?.user?.email : " usuário não está logado"}</p>
      {session?.user?.email && (
        <form action={handleAuth}>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Logout</button>
        </form>
      )}

      <Link href="/pagamentos">Pagamentos</Link>
    </div>
  );
}
