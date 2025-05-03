"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import '@/styles/globals.css';
import Header from "@/components/Header";
import { FormEvent, useState } from "react";


const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const formData = new FormData(e.currentTarget);
    const values = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      const user = await apiService.post<User>("/users/login", values);
      localStorage.setItem("user", JSON.stringify(user));
      router.push(user.isAdmin ? "/admin" : "/logged-in");
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(`Login failed: ${error.message}`);
      } else {
        console.error("Unknown login error");
      }
    }
  };

  return (
    <>
      <Header />

      <div className=" relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        {loginError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div role="alert" className="alert alert-error alert-soft">
              <span>{loginError}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-md h-100 shadow-md border p-8 flex flex-col gap-4">
            <div className="fieldset-legend text-2xl font-semibold text-center mb-4">Login</div>

            <label className="label text-sm">Username</label>
            <input name="username" type="text" className="input validator w-full" placeholder="Username" required />

            <label className="label text-sm">Password</label>
            <input name="password" type="password" className="input validator w-full" placeholder="Password" required />

            <button className="btn btn-neutral mt-4">Login</button>
          </fieldset>
        </form >
      </div >
    </>
  );
};

export default Login;
