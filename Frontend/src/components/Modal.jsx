import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import logo from "/logon.png";
import { handleSuccess } from "../utils/authSwal";

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
            handleSuccess("Signin successful!");
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
                handleSuccess("Signin successful!");
              })
              .then(() => {
                setTimeout(() => {
                  document.getElementById("my_modal_5").close()
                }, 5000);
              });
          })
          .catch((error) => console.log(error));
    };
    return (
      <dialog id="my_modal_5" className="modal modal-middle">
        <div className="modal-box max-w-md py-6 px-10 rounded-xl shadow-lg">
          <button 
            onClick={() => document.getElementById("my_modal_5").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >✕</button>
    
          <div className="text-center">
            <div className="flex justify-center">
              <img src={logo} alt="" className="w-[150px]" />
            </div>
            <h3 className="mt-4 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
    
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" method="dialog">
            <div className="rounded-md shadow-sm space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="modal-email"
                  type="email"
                  placeholder="you@example.com"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  {...register("email")}
                />
              </div>
    
              {/* Password */}
              <div>
                <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="modal-password"
                  type="password"
                  placeholder="Abcd1234"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  {...register("password")}
                />
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </form>
    
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
                  onClick={handleLogin}
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
      </dialog>
    );
};

export default Modal;


// import React, { useContext, useState } from "react";
// import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form"
// import { AuthContext } from "../contexts/AuthProvider";
// import axios from "axios";
// import useAuth from "../hooks/useAuth";
// import useAxiosPublic from "../hooks/useAxiosPublic";

// const Modal = () => {
//   const {
//       register,
//       handleSubmit,
//       formState: { errors },
//   } = useForm();
  
//   const { signUpWithGmail, login, logOut } = useAuth();
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const axiosPublic = useAxiosPublic();
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//       setIsLoading(true);
//       setErrorMessage("");
      
//       try {
//           const { user } = await login(data.email, data.password);
          
//           // Check verification without completing login
//           if (!user.emailVerified) {
//               await logOut(); // Ensure user stays logged out
//               setErrorMessage(
//                   "Email not verified." +
//                   "Please check your inbox and verify your email before logging in."
//               );
//               setIsLoading(false);
//               return;
//           }
          
//           // Only proceed if email is verified
//           const userInfo = {
//               name: data.name,
//               email: data.email,
//               photoURL: data.photoURL,
//           };
          
//           await axiosPublic.post("/users", userInfo);
          
//           alert("Login successful!");
//           document.getElementById("my_modal_5").close();
//           navigate('/');
//       } catch (error) {
//           if (error.response && error.response.status === 302) {
//             alert("Login successful!");
//             document.getElementById("my_modal_5").close();
//             navigate('/');
//           }
//           console.error("Login error:", error);
//           setErrorMessage("Invalid email or password");
//       } finally {
//           setIsLoading(false);
//       }
//   };

//     // google signin
//     const handleLogin = () => {
//       signUpWithGmail()
//           .then((result) => {
//             const user = result.user;
//             const userInfor = {
//               name: result?.user?.displayName,
//               email: result?.user?.email,
//               photoURL: result?.user?.photoURL
//             };
//             axiosPublic.post("/users", userInfor)
//               .then((response) => {
//                 // console.log(response);
//                 alert("Signin successful with Gmail!");
//                 document.getElementById("my_modal_5").close()
//                 navigate("/");
//               });
//           })
//           .catch((error) => console.log(error));
//     };
//   return (
//     <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
//       <div className="modal-box">
//         <div className="modal-action flex flex-col justify-center mt-0">
//           <form onSubmit={handleSubmit(onSubmit)} className="card-body" method="dialog">
//           <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h3>

//             {/* email */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="email"
//                 className="input input-bordered"
//                 {...register("email")}
//               />
//             </div>

//             {/* password */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Password</span>
//               </label>
//               <input
//                 type="password"
//                 placeholder="password"
//                 className="input input-bordered"
//                 {...register("password")}
//               />
//               <label className="label mt-1">
//                 <a href="#" className="label-text-alt link link-hover">
//                   Forgot password?
//                 </a>
//               </label>
//             </div>

//             {/* error */}
//             {
//               errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
//             }

//             {/* login btn */}
//             <div className="form-control mt-4">
//               <input
//                 type="submit"
//                 value="Login"
//                 className="btn bg-green-500 text-white"
//               />
//             </div>

//             <p className="text-center my-2">
//               Don't have an account?{" "}
//               <Link to="/signup" className="underline text-red ml-1">
//                 Signup Now
//               </Link>{" "}
//             </p>

//             <button 
//             htmlFor="my_modal_5"
//             onClick={() => document.getElementById("my_modal_5").close()}
//             className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//             >✕</button>
//           </form>

//           {/* social sign in */}
//           <div className="text-center space-x-3 mb-5">
//             <button className="btn btn-circle hover:bg-green-500 hover:text-white" onClick={handleLogin}>
//               <FaGoogle />
//             </button>
//             <button className="btn btn-circle hover:bg-green-500 hover:text-white">
//               <FaFacebookF />
//             </button>
//             <button className="btn btn-circle hover:bg-green-500 hover:text-white">
//             <FaGithub />
//             </button>
//           </div>
//         </div>
//       </div>
//     </dialog>
//   );
// };

// export default Modal;