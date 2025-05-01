import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUpload } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { MdEditSquare } from "react-icons/md";

const BookingComponent = ({currentuser, id, price, keyMoney, owner}) => {
  const {user} = useAuth();
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd } = useForm();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, setValue } = useForm();
  const [isUser, isUserLoading] = useUser();
  const axiosSecure = useAxiosSecure();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(null);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate(null);

  const fetchBooking = async () => {
    setLoading(true); 
    try {
        const response = await axiosSecure.get(`http://localhost:3000/booking/${currentuser}/${id}`);
        setBooking(response.data); 
    } catch (error) {
        console.error("Error fetching booking:", error);
        setBooking(null); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [currentuser, id]);

  const refetchBooking = () => {
    setTimeout(() => {
        fetchBooking();
    }, 1000); 
  };

  const onSubmitAdd = async (data) => {
    try {
      const Booking = {
        listing: id,
        email: currentuser,
        movein: data.movein,
        payvia: data.paymethod,
        needs: data.needs.length>1 && data.needs || 'Not Specified',
      };

      const postBooking = await axiosSecure.post('/booking', Booking);

      if (postBooking.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Booking Created Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        resetAdd();
        refetchBooking();
        setUpdate(false);
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Booking Failed',
        text: 'An error occurred while creating your booking.',
        showConfirmButton: true,
      });
    }
  };

  const onSubmitUpdate = async (data) => {
    try {
      const Booking = {
        movein: data.movein,
        payvia: data.paymethod,
        needs: data.needs,
        status: "Pending",
      };

      const postBooking = await axiosSecure.patch(`/booking/${booking._id}`, Booking);

      if (postBooking.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Booking Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        resetAdd();
        refetchBooking();
        setUpdate(false);
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating your booking.',
        showConfirmButton: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const toggleUpdate = () => {
    setUpdate((prevUpdate) => !prevUpdate);
  };

  const makePayment = () => {
    navigate("/pay-boarding", { state: { Rent: price, KeyMoney: keyMoney, Listing: id, Booking:booking._id } });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/booking/${booking?._id}`);
       if(res) {
        refetchBooking();
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your booking has been deleted",
            showConfirmButton: false,
            timer: 1500
          });
       }
      }
    });
  }

  return (
    <div className="space-y-6">
      {user ? (
        isUser ? (
          <div className="">
            {!booking ? (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className='mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Make a Booking 
                  </h2>
                  <div className="w-20 h-1 bg-green-500 mt-2"></div>
                </div>
                
                <form onSubmit={handleSubmitAdd(onSubmitAdd)} className="space-y-6">
                  <div className='form-control'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Your e-mail
                    </label>
                    <input
                      type='text'
                      defaultValue={user.email}
                      disabled
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50'
                    />
                  </div>
                  
                  <div className='form-control'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Move-in Date Preference
                    </label>
                    <select
                      {...registerAdd('movein', { required: true })}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      defaultValue=''
                    >
                      <option value='' disabled>Select move-in timeframe</option>
                      <option value='Immediately'>Immediately</option>
                      <option value='1-Week'>Within 1 Week</option>
                      <option value='2-Weeks'>Within 2 Weeks</option>
                      <option value='1-Month'>Within 1 Month</option>
                    </select>
                  </div>

                  <div className='form-control'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Payment Method
                    </label>
                    <select
                      {...registerAdd('paymethod', { required: true })}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      defaultValue=''
                    >
                      <option value='' disabled>Select payment method</option>
                      <option value='Card'>Credit/Debit Card</option>
                      <option value='Cash'>Cash Payment</option>
                      <option value='Bank'>Bank Transfer</option>
                    </select>
                  </div>

                  <div className='form-control'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Special Requirements
                    </label>
                    <textarea
                      {...registerAdd('needs')}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      placeholder='Any special accommodations or requests'
                      rows='3'
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className='w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2'
                  >
                    Submit Booking Request
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Your Booking Details 
                  </h2>
                  <button
                    onClick={() => toggleUpdate()}
                    className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition duration-300"
                  >
                    <MdEditSquare className="text-xl" />
                  </button>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <button
                      onClick={() => makePayment()}
                      disabled={!(booking.status === 'Approved')}
                      className={`w-full font-medium py-2 px-6 rounded-lg shadow-md transition duration-300 ${
                        (booking.status === 'Approved')
                          ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {booking.status === 'Approved' ? 'Make a Payment' : 'Payment Available After Approval'}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">STATUS</h3>
                          <p className={`text-lg font-medium ${booking.status === 'Approved' ? 'text-blue-600' : 'text-green-600'}`}>
                            {booking.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">PAYMENT</h3>
                          <p className={`text-lg font-medium ${booking.paystatus === 'Done' ? 'text-green-600' : 'text-green-600'}`}>
                            {booking.paystatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {booking.payment > 0 && (
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-lg mr-4">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">PAID AMOUNT</h3>
                            <p className="text-lg font-medium text-gray-900">
                              {booking.payment} LKR
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">BOOKING DATE</h3>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* {booking.status === 'Approved' && booking.paystatus !== 'Done' && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => makePayment()}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-300"
                      >
                        Complete Payment
                      </button>
                    </div>
                  )} */}
                  {/* <div className="w-full mt-4">
                    <button
                      onClick={() => makePayment()}
                      disabled={!(booking.status === 'Approved')}
                      className={`w-full font-medium py-2 px-6 rounded-lg shadow-md transition duration-300 ${
                        (booking.status === 'Approved')
                          ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Make a Payment
                    </button>
                  </div> */}
                </div>

                {!update ? (
                  <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Booking Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">MOVE-IN TIME</h4>
                        <p className="text-gray-900 mt-1">{booking.movein}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">PAYMENT METHOD</h4>
                        <p className="text-gray-900 mt-1">{booking.payvia}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">SPECIAL REQUIREMENTS</h4>
                        <p className="text-gray-900 mt-1">{booking.needs}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                      Update Booking Details
                    </h2>
                    <form onSubmit={handleSubmitUpdate(onSubmitUpdate)} className="space-y-6">
                      <div className='form-control'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Move-in Date Preference
                        </label>
                        <select
                          {...registerUpdate('movein', { required: true })}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                          defaultValue={booking.movein}
                        >
                          <option value='Immediately'>Immediately</option>
                          <option value='1-Week'>Within 1 Week</option>
                          <option value='2-Weeks'>Within 2 Weeks</option>
                          <option value='1-Month'>Within 1 Month</option>
                        </select>
                      </div>

                      <div className='form-control'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Payment Method
                        </label>
                        <select
                          {...registerUpdate('paymethod', { required: true })}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                          defaultValue={booking.payvia}
                        >
                          <option value='Card'>Credit/Debit Card</option>
                          <option value='Cash'>Cash Payment</option>
                          <option value='Bank'>Bank Transfer</option>
                        </select>
                      </div>

                      <div className='form-control'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Special Requirements
                        </label>
                        <textarea
                          {...registerUpdate('needs')}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                          defaultValue={booking.needs}
                          rows='3'
                        ></textarea>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          type="submit" 
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={handleDelete} 
                          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Student Access Required</h3>
          <p className="text-green-800 mb-4">
          Only students can make booking requests.
          </p>
          </div>
        )
      ) : (
        <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
          <p className="text-green-800 mb-4">
            Sign in to make a booking request.
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingComponent