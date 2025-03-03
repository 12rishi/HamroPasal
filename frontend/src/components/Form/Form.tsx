import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import schema from "../../services/validationyup";
import { useNavigate } from "react-router-dom";

const Form: React.FC<{ type: string }> = ({ type }) => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const {
    register,

    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<any>({
    resolver: yupResolver(type == "login" ? schema.login : schema.register),
    mode: "onBlur",
    shouldUnregister: true,
  });
  const submit = (data: any) => {
    console.log(data);
    localStorage.setItem("token", "haha");
    reset();
    navigate("/");
  };
  const error = (field: any) => {
    return errors[field]?.message ? String(errors[field]?.message) : "";
  };

  return (
    <div
      className=" flex items-center justify-center min-h-screen p-4 "
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url("/bg.avif")`,
      }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 md:p-8 transition-all duration-300">
        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b border-gray-200">
          <button
            onClick={() => setIsSignIn(true)}
            className={`w-1/2 text-center text-gray-600 pb-2 font-medium border-b-2 transition ${
              isSignIn
                ? "text-teal-600 border-teal-500"
                : "border-transparent hover:border-teal-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`w-1/2 text-center text-gray-600 pb-2 font-medium border-b-2 transition ${
              !isSignIn
                ? "text-teal-600 border-teal-500"
                : "border-transparent hover:border-teal-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {type == "login" && isSignIn ? (
          <form className="space-y-4" onSubmit={handleSubmit(submit)}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
                placeholder="Enter your email"
                {...register("email")}
              />
              <small className="text-red-500">{error("email") as string}</small>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
                placeholder="••••••••"
                {...register("password")}
              />
              <small className="text-red-500">
                {error("password") as string}
              </small>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div> */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Sign In
            </button>
          </form>
        ) : (
          // Sign Up Form
          <form className="space-y-4" onSubmit={handleSubmit(submit)}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
                placeholder="Enter your Name"
                {...register("userName")}
              />
              <small className="text-red-500">
                {error("userName") as string}
              </small>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
                placeholder="Enter your email"
                {...register("email")}
              />
              <small className="text-red-500">{error("email") as string}</small>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
                placeholder="••••••••"
                {...register("password")}
              />
              <small className="text-red-500">
                {error("password") as string}
              </small>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:slate-500 form-input"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              <small className="text-red-500">
                {error("confirmPassword") as string}
              </small>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Form;
