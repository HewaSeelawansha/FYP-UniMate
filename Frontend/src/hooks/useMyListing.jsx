import React, { useContext } from 'react'
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';

  const useMyListing = () => {
    const {user} = useAuth();
    const token = localStorage.getItem('access-token');

    const {data: mylist =[], isPending: loading, refetch} = useQuery({
        queryKey: ['listing', user?.email],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/listing/owner?email=${user?.email}`,{
              headers: {
                authorization : `Bearer ${token}`,
              },
              method: 'GET',
            })
            return res.json();
        },
    })
  return [mylist, loading, refetch]
}

export default useMyListing
