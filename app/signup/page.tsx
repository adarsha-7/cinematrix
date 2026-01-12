"use client";

import { useState, ChangeEvent } from "react";
import { Eye, EyeOff,Film } from "lucide-react";

interface SignupForm {
  fullname: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupForm>({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex min-h-[600px]">

        {/* LEFT – FORM */}
        <div className="w-1/2 p-12 flex items-center">
          <div className="max-w-md w-full mx-auto">

            <h1 className="text-4xl font-light text-gray-800 font-serif mb-2">
              Create an Account
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Signup to join our community
            </p>

            {/* SOCIAL BUTTONS */}
                    <div className="flex items-center justify-center mb-6">
            {/* Google */}
            <button className="flex items-center justify-center w-40 gap-2 py-3 border-2 border-gray-300 rounded-full hover:border-gray-400 transition text-sm text-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
            </button>

           
            </div>


            {/* DIVIDER */}
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <span className="flex-1 h-px bg-gray-300" />
            </div>

            {/* FULL NAME */}
            <div className="mb-5">
              <label className="block text-sm text-black font-serif mb-2">
                Fullname
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your Fullname"
                className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-gray-400 text-sm text-gray-700"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm text-black font-serif mb-2">
                Email id
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email id"
                className="w-full px-4 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-gray-400 text-sm text-gray-700"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <label className="block text-sm text-black font-serif mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-gray-400 text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-full font-medium transition mb-4"
            >
              Sign up
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span className="text-red-800 cursor-pointer hover:underline">
                Log in
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT – HERO */}
        <div className="w-1/2 bg-black relative text-white overflow-hidden">

           <div className="absolute top-8 right-8 flex items-center gap-2">
            <Film className="w-5 h-5 text-red-600" />
            <span className="text-white text-2xl font-bold">Cinematrix</span>
          </div>
          {/* HERO TEXT */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 text-right">
            <h2 className="text-6xl font-bold">Create Your</h2>
            <h2 className="text-6xl font-bold text-red-600">Cinematic</h2>
            <h2 className="text-6xl font-bold text-red-600 mb-6">Journey</h2>

            <p className="text-xl">
              Lights Camera <span className="text-red-600">Connect</span>!!
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <span className="w-12 h-1 bg-red-600" />
              <span className="w-12 h-1 bg-gray-600" />
              <span className="w-12 h-1 bg-gray-600" />
            </div>
          </div>

          {/* FOOTER */}
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400">
            © 2025 Cinematrix. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
