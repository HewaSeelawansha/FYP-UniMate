import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Modal from "./Modal";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import logo from "/logon.png";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
      } = useForm();

      const {createUser, signUpWithGmail, updateUserProfile, sendEmail, logOut} = useContext(AuthContext);
      const axiosPublic = useAxiosPublic();
      const [isLoading, setIsLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const navigate = useNavigate();

      // const onSubmit = (data) => {
      //   const email = data.email;
      //   const password = data.password;
        
      //   createUser(email, password)
      //     .then((result) => {
      //       const user = result.user;
      
      //       // Send email verification
      //       return sendEmail()
      //       .then(() => {
      //         alert('A verification email has been sent. Please check your inbox and verify your email before logging in.');
      //         // Update user profile with correct data
      //         return logOut();
      //       });
      //     })
      //     .then(() => {
      //       navigate("/login"); // Redirect to login after everything is done
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //       if (error.code === 'auth/email-already-in-use') {
      //         alert('This email is already registered. Please use a different email or login instead.');
      //       } else {
      //         alert('Error during signup: ' + error.message);
      //       }
      //     });
      // };

      const onSubmit = (data) => {
        if(data.password !== data.confirmPassword){
          setErrorMessage("Passwords do not match");
          return;
        }

        setIsLoading(true);
        setErrorMessage("");

        const email = data.email;
        const password = data.password;
        
        createUser(email, password)
          .then((result) => {
            const user = result.user;
            
            // Update user profile first
            return updateUserProfile(data.name, data.photoURL)
              .then(() => {
                // Send verification email
                return sendEmail();
              })
              .then(() => {
                alert('A verification email has been sent. Please check your inbox and verify your email before logging in.');
                // Automatically log out the user
                return logOut();
              });
          })
          .then(() => {
            // Redirect to login after signup
            navigate("/login");
          })
          .catch((error) => {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
              alert('This email is already registered. Please use a different email or login instead.');
            } else {
              setErrorMessage(error.message || "Signup failed. Please try again.");
            }
          })
          .then(()=>{
            setIsLoading(false);
          });
      };


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
          .catch((error) => {
            if (error.response && error.response.status === 302) {
              navigate('/');
            }
            console.error("Login error:", error);
            setErrorMessage("Login Error!");
          }).then(() => {
            navigate("/");
          });
      };
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="flex justify-center">
                <img src={logo} alt="" className="w-[150px]" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join us today!
              </p>
            </div>
    
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-md shadow-sm space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Samuel Perera"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>
    
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
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
    
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Abcd1234"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Re-enter your password"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: (value) => 
                        value === getValues("password") || "Passwords do not match"
                    })}
                  />
                  {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
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
                      Signing up...
                    </span>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-3 px-4 border border-emerald-500 text-sm font-semibold rounded-md text-emerald-600 bg-white hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                    Or sign up with
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
    
            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
}

export default Signup