import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Modal = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
    const {signUpWithGmail, login} = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const axiosPublic = useAxiosPublic();

    // redirecting to home page or specifig page
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
  

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    // console.log(email, password)
    login(email, password)
      .then((result) => {
        // Signed in
        const user = result.user;
        const userInfor = {
          name: data.name,
          email: data.email,
          photoURL: data.photoURL
        };
        axiosPublic.post("/users", userInfor)
          .then((response) => {
            console.log(response);
            alert("Signin successful!");
            
          });
        // console.log(user);
        // ...
      }).then(() => {
        document.getElementById("my_modal_5").close()
        navigate('/');
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage("Please provide valid email & password!");
      });
  };

    // google signin
    const handleLogin = () => {
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
                document.getElementById("my_modal_5").close()
                navigate("/");
              });
          })
          .catch((error) => console.log(error));
    };
  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex flex-col justify-center mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body" method="dialog">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h3>

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
                {...register("password")}
              />
              <label className="label mt-1">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* error */}
            {
              errorMessage ? <p className="text-red text-xs italic">{errorMessage}</p> : ""
            }

            {/* login btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                value="Login"
                className="btn bg-green text-white"
              />
            </div>

            <p className="text-center my-2">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>{" "}
            </p>

            <button 
            htmlFor="my_modal_5"
            onClick={() => document.getElementById("my_modal_5").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button>
          </form>

          {/* social sign in */}
          <div className="text-center space-x-3 mb-5">
            <button className="btn btn-circle hover:bg-green hover:text-white" onClick={handleLogin}>
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
    </dialog>
  );
};

export default Modal;