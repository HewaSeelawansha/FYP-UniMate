import React from 'react'
import useAuth from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { FaUpload } from 'react-icons/fa6';

const BookingComponent = ({id, place, title, owner}) => {
  const {user} = useAuth();
  const { register, handleSubmit, reset } = useForm();



  return (
    <div className="bg-black rounded-lg p-4">
      <div className="bg-gray-300 mb-2 rounded-lg p-2 pb-4">
        <div className='p-2'>
        <h2 className='mb-4 text-xl font-bold'>
          Make a booking
        </h2>
        <p className='font-mono text-gray-500 mb-2'>Once the request accepted you will see a link <span className='text-green'>here</span> to the payments page.</p>
        </div>
        <div className="border bg-gray-300 rounded-lg p-4 px-2">
          <form onSubmit>
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
                  Owner
                </label>
                <input
                  type='text'
                  defaultValue={owner}
                  disabled
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div className='form-control'>
                <label className='block text-sm font-medium mb-2'>
                  Listing Title
                </label>
                <input
                  type='text'
                  placeholder='Pick a type to generate'
                  defaultValue={title}
                  disabled
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div className='form-control'>
                <label className='block text-sm font-medium mb-2'>
                  Boarding House
                </label>
                <input
                  type='text'
                  placeholder='Pick a type to generate'
                  defaultValue={place}
                  disabled
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div className='form-control'>
                <label className='block text-sm font-medium mb-2'>
                  Select when would you like to move in
                </label>
                <select
                  {...register('movein', { required: true })}
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
                    Gender
                  </label>
                  <select
                    {...register('gender', { required: true })}
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    defaultValue=''
                  >
                    <option value='' disabled>Pick one</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </select>
                </div>

                <div className='form-control w-full'>
                  <label className='block text-sm font-medium mb-2'>
                    Payment Method
                  </label>
                  <select
                    {...register('paymethod', { required: true })}
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
                  {...register('description', { required: true })}
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Special Needs'
                  defaultValue=''
                  rows='2'
                ></textarea>
              </div>

              <button className='w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-black transition duration-300 flex items-center justify-center gap-2'>
                Upload <FaUpload />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingComponent