import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import logo from "/logon.png";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {login, signUpWithGmail, logOut} = useAuth();
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //react hook form
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
        const { user } = await login(data.email, data.password);
        
        // Check verification without completing login
        if (!user.emailVerified) {
            await logOut(); // Ensure user stays logged out
            setErrorMessage(
                "Email not verified." +
                "Please check your inbox and verify your email before logging in."
            );
            setIsLoading(false);
            return;
        }
        
        // Only proceed if email is verified
        const userInfo = {
            name: data.name,
            email: data.email,
            photoURL: data.photoURL,
        };
        
        await axiosPublic.post("/users", userInfo);
        
        alert("Login successful!");
        navigate('/');
    } catch (error) {
        if (error.response && error.response.status === 302) {
          navigate('/');
        }
        console.error("Login error:", error);
        setErrorMessage("Invalid email or password");
    } finally {
        setIsLoading(false);
    }
};

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          photoURL: result?.user?.photoURL
        };
        axiosPublic.post("/users", userInfor)
          .then((response) => {
            // console.log(response);
            alert("Signin successful with Gmail!");
            navigate("/");
          });
      })
      .catch((error) => console.log(error));
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="flex justify-center">
          <img src={logo} alt="" className="w-[150px]" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="you@example.com"
              {...register("email")}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Abcd1234"
              {...register("password", { required: true })}
            />
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4">
        <button
          onClick={() => navigate('/')}
          className="w-full flex justify-center py-3 px-4 border border-emerald-500 text-sm font-semibold rounded-md text-emerald-600 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue as Guest
        </button>
      </div>

      {/* Social login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleRegister}
            className="w-full gap-2 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FcGoogle className="h-5 w-5 text-blue-600" />
            Log in with Google
          </button>
        </div>
      </div>

      {/* Sign up link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}

export default Login