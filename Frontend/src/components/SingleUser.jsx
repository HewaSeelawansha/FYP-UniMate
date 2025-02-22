import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAdmin from '../hooks/useAdmin';

const SingleUser = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useAdmin(); // Check if the user is an admin

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${email}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [email]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteUser = user => {
    axiosSecure.delete(`/users/${user._id}`).then(res => {
      alert(`${user.name} is removed from database`);
      refetch();
    })
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!person) {
    return (
      <div className="w-full lg:w-[780px] md:w-[520px] px-2 mx-auto py-4">
        <h2 className="text-3xl font-bold text-center">
          User Doesn't Exist!{' '}
          <button onClick={handleGoBack} className="text-green underline">
            Go Back
          </button>
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full xl:w-[1280px] lg:w-[780px] md:w-[520px] px-2 mx-auto py-4">
      <h2 className="text-3xl font-bold text-center mb-5">
        UniMate User - <span className="text-green">{person.name}</span>
      </h2>

      {/* Profile Card */}
      <div className="max-w-4xl w-full bg-gray-200 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-black text-white p-8 flex flex-col items-center justify-center md:w-1/3">
          <div className="avatar">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-green">
              <img src={person?.photoURL || 'https://i.ibb.co/tPJnyqL1/btmn.jpg'} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-4">{person?.name}</h3>
        </div>

        {/* User Details */}
        <div className="p-6 flex-1">
          <div className="bg-gray-100 mb-5 p-10 rounded-lg">
            <p className="text-gray-700 mb-5">
              <strong>Role:</strong><span className= {person.role === 'admin' ? 'text-rose-500 font-semibold' : person.role === 'owner' ? 'text-blue-500 font-semibold' : person.role === 'user' ? 'text-emerald-500 font-semibold':''}> 
                {person?.role==='user'?' Student':person?.role==='admin'?' Admin(You)': person?.role==='owner'? ' Owner':person?.role}</span>
            </p>
            <p className="text-gray-700 mb-5"><strong>e-mail:</strong> {person?.email}</p>
          <p className="text-gray-700">
            <strong>Registered on:</strong> {new Date(person?.createdAt).toLocaleDateString()}
          </p>
          </div>

          {/* Admin Actions */}
          {isAdmin && person?.role !== 'admin' ? (
              <button
                className="mb-5 w-full font-bold bg-green text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300"
                onClick={() => handleDeleteUser(user)}
              >
                Delete User
              </button>
          ): <></>}
          <button onClick={handleGoBack} className="w-full font-bold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-300 transition duration-300">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
