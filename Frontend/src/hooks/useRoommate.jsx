import React from 'react';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useRoommateUsers = () => {
    const axiosPublic = useAxiosPublic();

    const { data: users = [], isPending: loading, refetch } = useQuery({
        queryKey: ['roommateUsers'],
        queryFn: async () => {
            const res = await axiosPublic.get('users/roommates');
            return res.data; 
        },
    });

    return [users, loading, refetch];
};

export default useRoommateUsers;