import React, { useContext } from 'react'
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure'

  const useMyListing = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: mylist =[], isPending: loading, refetch} = useQuery({
        queryKey: ['listing', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/listing/owner?email=${user?.email}`)
            return res.data;
        },
    })
  return [mylist, loading, refetch]
}

export default useMyListing