import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useListings = () => {
    const axiosPublic = useAxiosPublic();

    const {data: listing =[], isPending: loading, refetch} = useQuery({
        queryKey: ['listing'],
        queryFn: async () => {
            const res = await axiosPublic.get('/listing');
            return res.data;
          },
    })

  return [listing, loading, refetch]
}

export default useListings