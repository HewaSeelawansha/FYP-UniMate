import React from 'react'
import useAxiosPublic from './useAxiosPublic'
import { useQuery } from '@tanstack/react-query';

const useBoarding = () => {
    const axiosPublic = useAxiosPublic();

    const {data: boarding =[], isPending: loading, refetch} = useQuery({
        queryKey: ['boarding'],
        queryFn: async () => {
            const res = await axiosPublic.get('/boarding');
            return res.data;
          },
    })

  return [boarding, loading, refetch]
}

export default useBoarding