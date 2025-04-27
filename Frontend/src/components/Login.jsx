import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {login, signUpWithGmail, logOut} = useAuth();
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
    <div className="mb-5">
    <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover mt-2">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* show errors */}
            {
              errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            }

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-green text-white"
                value="Login"
              />
            </div>

            {/* close btn */}
            <Link to="/">
            <div
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </div></Link>

            <p className="text-center my-2">
              Donot have an account?
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>
            </p>
          </form>
    <div className="text-center space-x-3">
        <button onClick={handleRegister} className="btn btn-circle hover:bg-green hover:text-white">
          <FaGoogle />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaFacebookF />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaGithub />
        </button>
      </div>
    </div>
  </div>
  )
}

export default Login