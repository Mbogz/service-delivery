import { FormEvent, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSession } from "../providers/useSession";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return toast.error("Invalid credentials");
    }
    navigate("/app/dashboard");
    toast.success("Successfully signed in");
  };

  return (
    <div className="flex flex-col w-full self-center">
      <form
        className="flex flex-col self-center gap-4 min-w-[500px]"
        onSubmit={handleLogin}
      >
        <h1 className="text-center font-bold text-3xl">Login</h1>
        <p className="text-center  text-lg text-gray-700">
          Enter your email and password
        </p>
        <input
          className="border-2 border-gray-300 p-2 bg-white rounded-lg"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-gray-300 p-2 bg-white rounded-lg"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white font-bold py-2">
          Login
        </button>
      </form>
    </div>
  );
}