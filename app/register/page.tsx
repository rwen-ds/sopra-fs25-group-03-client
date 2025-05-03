"use client";

import "@ant-design/v5-patch-for-react-19";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import '@/styles/globals.css';
import Header from "@/components/Header";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";


const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const values = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const user = await apiService.post<User>("/users", values);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/logged-in");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Register failed: ${error.message}`);
      } else {
        console.error("Unknown login error");
      }
    }
  };

  return (
    <>
      <Header />

      <div className=" relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        {errorMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div role="alert" className="alert alert-error alert-soft">
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleRegister}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-md h-130 shadow-md border p-8 flex flex-col gap-4">
            <div className="fieldset-legend text-2xl font-semibold text-center mb-4">Register</div>

            <label className="label text-sm">Username</label>
            <input name="username" type="username" className="input validator w-full" placeholder="Username" required />

            <label className="label text-sm">Email</label>
            <input name="email" type="email" className="input validator w-full" placeholder="Email" required />

            <label className="label text-sm">Password</label>
            <input name="password" type="password" className="input validator w-full" placeholder="Password" required />

            <button className="btn btn-neutral mt-4">Register</button>
          </fieldset>
        </form >
      </div >
    </>
  );
};

export default Register;
