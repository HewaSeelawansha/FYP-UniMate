// import React, { useContext, useState, useEffect } from 'react';
// // import useCart from '../../hooks/useCart';
// import { FaTrashAlt } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import { AuthContext } from '../../contexts/AuthProvider';
// import {Link} from 'react-router-dom'
// import axios from "axios";

// const CartPage = () => {
//   const [cart, refetch] = useCart();
//   const { user } = useContext(AuthContext);
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     if (JSON.stringify(cart) !== JSON.stringify(cartItems)) {
//       setCartItems(cart);
//     }
//   }, [cart]);

//   const calculatePrice = (item) => {
//     return item.quantity * item.price;
//   };

//   const updateCartItem = (item, newQuantity) => {
//     setCartItems((prevCartItems) =>
//       prevCartItems.map((cartItem) =>
//         cartItem._id === item._id
//           ? { ...cartItem, quantity: newQuantity }
//           : cartItem
//       )
//     );

//     fetch(`http://localhost:3000/carts/${item._id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json; charset=UTF-8' },
//       body: JSON.stringify({ quantity: newQuantity }),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         refetch();
//       })
//       .catch((err) => console.error('Error updating cart:', err));
//   };

//   const handleMinus = (item) => {
//     if (item.quantity > 1) {
//       updateCartItem(item, item.quantity - 1);
//     } else {
//       Swal.fire('Item count can’t be zero!');
//     }
//   };

//   const handlePlus = (item) => {
//     updateCartItem(item, item.quantity + 1);
//   };

//   const handleDlt = (item) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios.delete(`http://localhost:3000/carts/${item._id}`).then(response => {
//           if (response) {
//             refetch();
//              Swal.fire("Deleted!", "Your file has been deleted.", "success");
//            }
//         })
//         .catch(error => {
//           console.error(error);
//         });
//       }
//     });
//   };

//   return (
//     <div className='section-container mb-20'>
//       {/*banners*/}
//       <div className='bg-gradient-to-r from-[#FAFAFA] from-0 to-[#FCFCFC] to-100%'>
//         <div className='py-36 flex flex-col justify-center items-center gap-8'>
//           {/*text*/}
//           <div className='space-y-7 px-4'>
//             <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>
//               Items Added to the <span className='text-green'> Cart</span>
//             </h2>
//           </div>
//         </div>
//       </div>
//       {/*table*/}
//       {
//         (cart.length > 0) ? <div>
//       <div>
//         <div className="overflow-x-auto">
//           <table className="table bg-gray-200 rounded-sm">
//             {/* head */}
//             <thead className="bg-blue-300 text-white">
//               <tr>
//                 <th>#</th>
//                 <th>Food</th>
//                 <th>Item Name</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Action</th> 
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <div className="flex items-center gap-3">
//                       <div className="avatar">
//                         <div className="mask mask-squircle h-12 w-12">
//                           <img
//                             src={item.image}
//                             alt="Food Item"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className='font-semibold'>
//                     {item.name}
//                   </td>
//                   <td className='flex items-center'>
//                     <button onClick={() => handleMinus(item)} className='bg-white btn btn-xs'>-</button>
//                     <input className='bg-gray-200 w-10 mx-2 text-center overflow-hidden appearance-none' type="number" value={item.quantity} readOnly />
//                     <button onClick={() => handlePlus(item)} className='bg-yellow-300 btn btn-xs'>+</button>
//                   </td>
//                   <td>
//                     ${calculatePrice(item).toFixed(2)}
//                   </td>
//                   <th>
//                     <button onClick={() => handleDlt(item)} className=" text-red text-lg btn btn-ghost btn-xs"><FaTrashAlt /></button>
//                   </th>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* calculations */}
//       <div className='my-12 flex flex-col md:flex-row justify-between items-start'>
//         <div className='md:w-1/2 space-y-3'>
//           <h3 className='font-medium'>Customer Details</h3>
//           <p>Name: {user.displayName}</p>
//           <p>Email: {user.email}</p>
//           <p>User_id: {user.uid}</p>
//         </div>
//         <div className='md:w-1/2 space-y-3'>
//           <h3 className='font-medium'>Order Details</h3>
//           <p>Total Items: {cartItems.length}</p>
//           <p>Total Price: ${cartItems.reduce((total, item) => total + calculatePrice(item), 0).toFixed(2)}</p>
//           <Link to="/process-checkout"><button className='mt-2 btn btn-sm bg-green hover:bg-gray-200 text-black rounded-full'>Proceed</button></Link>
//         </div>
//         </div>
//       </div> : <div className="text-center mt-20">
//         <p>Cart is empty. Please add products.</p>
//         <Link to="/menu"><button className="btn bg-green text-white mt-3">Back to Menu</button></Link>
//       </div>
//       }
//     </div>
//   );
// };

// export default CartPage;