import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import schema from "../../services/validationyup";
import { Link } from "react-router-dom";

const Form: React.FC<{ type: string; formSubmit: Function }> = ({
  type,
  formSubmit,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<any>({
    resolver: yupResolver(type === "login" ? schema.login : schema.register),
    mode: "onBlur",
    shouldUnregister: true,
  });

  const submit = (data: any) => {
    formSubmit(data);
  };

  const error = (field: any) => {
    return errors[field]?.message ? String(errors[field]?.message) : "";
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url("/bg.avif")`,
      }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 md:p-8 transition-all duration-300">
        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b border-gray-200">
          <button className="w-full text-center pb-2 font-medium border-b-2 transition text-teal-600 border-teal-500">
            {type == "login" ? "signIn" : "signUp"}
          </button>
        </div>

        {/* Sign In / Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          {type === "register" && (
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
              <small className="text-red-500">{error("userName")}</small>
            </div>
          )}

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
            <small className="text-red-500">{error("email")}</small>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
              placeholder="••••••••"
              autoComplete="off"
              {...register("password")}
            />
            <small className="text-red-500">{error("password")}</small>
          </div>

          {type === "register" && (
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
              <small className="text-red-500">{error("confirmPassword")}</small>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {type == "login" ? "signIn" : "signUp"}
          </button>

          <Link
            to={type == "login" ? "/register" : "/login"}
            className="w-full block text-center pb-2 font-medium border transition text-teal-600 border-teal-500"
          >
            {type == "login" ? "signUp" : "signIn"}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Form;
