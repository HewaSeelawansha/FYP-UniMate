import React from 'react'
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Payments = () => {
  const {user} = useAuth();
    const token = localStorage.getItem('access-token');

    const { refetch, data:orders = []} = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/payments?email=${user?.email}`,{
              headers: {
                authorization : `Bearer ${token}`,
              },
              method: 'GET',
            })
            return res.json();
        },
    })
    //console.log(orders)
    const onlyDate = (createdAt) => {
      const createdAtDate = new Date(createdAt);
      return createdAtDate.toLocaleDateString()
    }

  return (
    <div className='section-container mb-20'>
      {/*banners*/}
      <div className='bg-gradient-to-r from-[#FAFAFA] from-0 to-[#FCFCFC] to-100%'>
        <div className='py-36 flex flex-col justify-center items-center gap-8'>
          {/*text*/}
          <div className='space-y-7 px-4'>
            <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>
              Track Your <span className='text-green'>Orders</span>
            </h2>
          </div>
        </div>
      </div>
      {/*table*/}
      {
        (orders.length > 0) ? <div>
      <div>
        <div className="overflow-x-auto">
          <table className="table bg-gray-200 rounded-sm">
            {/* head */}
            <thead className="bg-blue-300 text-white">
              <tr>
                <th>#</th>
                <th>Order Date</th>
                <th>Transaction ID</th>
                <th>Price</th>
                <th>Status</th> 
                <th>Action</th> 
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td className='items-center font-semibold'>{index + 1}</td>
                  <td className='items-center font-mono'>
                    {onlyDate(item.createdAt)}
                  </td>
                  <td className='items-center font-semibold'>
                    {item.transactionId}
                  </td>
                  <td className='items-center'>
                    ${item.price}
                  </td>
                  <td className='items-center font-semibold'>
                    {item.status}
                  </td>
                  <td>
                    <Link className="bg-green hover:bg-blue-300 btn btn-xs" to='contact'>Contact</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div> : <div className="text-center mt-20">
        <p>No Any Existing Payments.</p>
        <Link to="/cart-page"><button className="btn bg-green text-white mt-3">Back to Cart</button></Link>
      </div>
      }
    </div>
  )
}

export default Payments