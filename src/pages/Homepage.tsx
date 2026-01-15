import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-4 self-center place-self-center w-full">
      <h1 className="text-center font-bold text-3xl">Helpy Admin</h1>
      <p className="text-center text-2xl">
        Welcome to the Helpy Admin Dashboard
      </p>
      <p className="text-center text-sm">
        This is a simple admin dashboard to manage your Helpy app
      </p>
      <div className="flex flex-row items-center  justify-center gap-4">
        <Link
          to={"login"}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login to continue
        </Link>
      </div>
    </main>
  );
}