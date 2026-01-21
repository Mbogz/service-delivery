import { Link, Outlet, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { useSession } from "../providers/useSession";

export default function AppLayout() {
  const navigate = useNavigate();
  const { session } = useSession();
  return (
    <section className="flex flex-col w-full h-full">
      <header className="bg-gray-800 flex justify-between items-center text-white p-4 border-b border-b-gray-200">
        <h1 className="text-2xl font-bold">Helpy Admin</h1>
        <div className="flex flex-row items-center gap-4">
          <p className="font-bold">{session?.user.email}</p>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              supabase.auth.signOut();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex flex-row flex-grow bg-gray-200 flex-1">
        <nav className="flex gap-4 w-[300px] bg-stone-900 p-6 flex-col">
          <Link to="/app/dashboard" className="text-blue-500">
            Dashboard
          </Link>
          <Link to="/app/service-providers" className="text-blue-500">
            Service Providers
          </Link>
          <Link to="/app/service-providers/add" className="text-blue-500">
            Add Service Provider
          </Link>
          <Link to="/app/bookings" className="text-blue-500">
            Bookings
          </Link>
          <Link to="/app/orders" className="text-blue-500">
            Orders
          </Link>
          <Link to="/app/categories" className="text-blue-500">
            Categories
          </Link>
        </nav>
        <main className="flex m-6 w-full">
          <Outlet />
        </main>
      </div>
    </section>
  );
}