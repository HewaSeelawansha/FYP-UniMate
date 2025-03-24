import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUpload } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const BookingComponent = ({currentuser, id, place, title, owner}) => {
  const {user} = useAuth();
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd } = useForm();
  const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset: resetUpdate, setValue } = useForm();
  const [isUser, isUserLoading] = useUser();
  const axiosSecure = useAxiosSecure();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(null);
  const [update, setUpdate] = useState(true);

  const fetchBooking = async () => {
    setLoading(true); 
    try {
        const response = await fetch(`http://localhost:3000/booking/${currentuser}/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch booking: ${response.statusText}`);
        }
        const data = await response.json();
        setBooking(data); 
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
        needs: data.needs
      };

      const postBooking = await axiosSecure.post('/booking', Booking);

      if (postBooking.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully Uploaded',
          showConfirmButton: false,
          timer: 1500,
        });
        resetAdd();
        refetchBooking();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Upload Failed',
        text: 'An error occurred.',
        showConfirmButton: true,
      });
    }
  };

  const onSubmitUpdate = async (data) => {
    try {
      const Booking = {
        movein: data.movein,
        payvia: data.paymethod,
        needs: data.needs
      };

      const postBooking = await axiosSecure.patch(`/booking/${booking._id}`, Booking);

      if (postBooking.data) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully Updated',
          showConfirmButton: false,
          timer: 1500,
        });
        resetAdd();
        refetchBooking();
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred.',
        showConfirmButton: true,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
}

  return (
    <div>
    {user ? (
      isUser ? (
        
      <div className="bg-black rounded-lg p-4">
        <div className="bg-gray-300 mb-2 rounded-lg p-2 pb-4">
          <div className='p-2'>
          <h2 className='mb-4 text-2xl font-bold'>
            Make a booking 
          </h2>
          {/* <h2 className='mb-4 text-xl text-green'>
            {title} - {place} by <span className='text-black'>{owner}</span>
          </h2> */}
          </div>
          {!booking ? (
          <div className="border bg-gray-300 rounded-lg p-4 px-2">
            <form onSubmit={handleSubmitAdd(onSubmitAdd)}>
              <div className='space-y-6'>
                <div className='form-control'>
                  <label className='block text-sm font-medium mb-2'>
                    Your e-mail
                  </label>
                  <input
                    type='text'
                    defaultValue={user.email}
                    disabled
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>
                <div className='form-control'>
                  <label className='block text-sm font-medium mb-2'>
                    Select when would you like to move in
                  </label>
                  <select
                    {...registerAdd('movein', { required: true })}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    defaultValue=''
                  >
                    <option value='' disabled>Pick one</option>
                    <option value='Immediately'>Immediately</option>
                    <option value='1-Week'>1-Week</option>
                    <option value='2-Weeks'>2-Weeks</option>
                    <option value='1-Month'>1-Month</option>
                  </select>
                </div>

                <div className='flex gap-4'>
                  <div className='form-control w-full'>
                    <label className='block text-sm font-medium mb-2'>
                      Payment Method
                    </label>
                    <select
                      {...registerAdd('paymethod', { required: true })}
                      className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      defaultValue=''
                    >
                      <option value='' disabled>Pick one</option>
                      <option value='Card'>Pay via Website (Card)</option>
                      <option value='Cash'>Cash in Hand</option>
                      <option value='Bank'>Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className='form-control'>
                  <label className='block text-sm font-medium mb-2'>
                    Special Needs
                  </label>
                  <textarea
                    {...registerAdd('needs')}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='Special Needs'
                    defaultValue=''
                    rows='2'
                  ></textarea>
                </div>

                <button className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black transition duration-300 flex items-center justify-center gap-2'>
                  Make a Booking
                </button>
              </div>
            </form>
          </div>
          ):(
            <div className="border bg-white rounded-lg p-4 px-2">
              {update}
              <div>
                <div>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Status: <span className='text-blue-500'>{booking.status}</span>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Payments: <span className='text-blue-500'>{booking.paystatus}</span>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Paid Amount: <span className='text-blue-500'>${booking.payment}</span>
                  </h2>
                </div>
                <hr />
                <div>
                  <h2 className='my-2 text-lg font-semibold'>
                    Email: <span className=''>{booking.email}</span>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Move In: <span className=''>{booking.movein}</span>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Payment Method: <span className=''>{booking.payvia}</span>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold'>
                    Needs: <span className=''>{booking.needs}</span>
                  </h2>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
                  <div className='space-y-6'>
                    <div className='form-control'>
                      <label className='block text-sm font-medium my-2'>
                        Your e-mail
                      </label>
                      <input
                        type='text'
                        defaultValue={user.email}
                        disabled
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                      />
                    </div>
        
                    <div className='form-control'>
                      <label className='block text-sm font-medium mb-2'>
                        Select when would you like to move in
                      </label>
                      <select
                        {...registerUpdate('movein', { required: true })}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        defaultValue={booking.movein}
                        // disabled
                      >
                        <option value='' disabled>Pick one</option>
                        <option value='Immediately'>Immediately</option>
                        <option value='1-Week'>1-Week</option>
                        <option value='2-Weeks'>2-Weeks</option>
                        <option value='1-Month'>1-Month</option>
                      </select>
                    </div>
        
                    <div className='flex gap-4'>
                      <div className='form-control w-full'>
                        <label className='block text-sm font-medium mb-2'>
                          Payment Method
                        </label>
                        <select
                          {...registerUpdate('paymethod', { required: true })}
                          className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                          defaultValue={booking.payvia}
                          // disabled
                        >
                          <option value='' disabled>Pick one</option>
                          <option value='Card'>Pay via Website (Card)</option>
                          <option value='Cash'>Cash in Hand</option>
                          <option value='Bank'>Bank Transfer</option>
                        </select>
                      </div>
                    </div>
        
                    <div className='form-control'>
                      <label className='block text-sm font-medium mb-2'>
                        Special Needs
                      </label>
                      <textarea
                        {...registerUpdate('needs')}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        placeholder='Special Needs'
                        defaultValue={booking.needs}
                        rows='2'
                        // disabled
                      ></textarea>
                    </div>

                    <div className='w-full flex gap-2 justify-between'>
                    <button className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black transition duration-300 flex items-center justify-center gap-2'>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(todo._id)} className="w-full bg-rose-500 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
                      Delete
                    </button>
                    </div>
        
                    
                  </div>
                </form>
              </div>
          </div>
          )}
        </div>
      </div>
      
      ) : (
        <div className="bg-gray-200 rounded-lg">
          <div className="p-4">
          <p className="font-bold">
            Only students can access
            <span className="text-green"> booking </span>
            listings.
          </p>
          </div>
        </div>
      )
    ) : (
      <div className="bg-gray-200 rounded-lg">
        <div className="p-4">
          <p className="font-bold">
            Please<span className="text-green"> login </span>to proceed with a booking.
          </p>
        </div>
      </div>
    )}
  </div>
  )
}

export default BookingComponent