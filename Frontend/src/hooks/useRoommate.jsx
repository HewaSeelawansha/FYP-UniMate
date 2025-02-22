import React from 'react';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';

const useRoommateUsers = () => {
    const {user} =  useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: users = [], isPending: loading, refetch } = useQuery({
        queryKey: [user?.email, 'roommateUsers'],
        queryFn: async () => {
            if (!user) return [];
            try {
            const res = await axiosPublic.get(`users/roommates/${user.email}`);
            return res.data; 
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    });

    return [users, loading, refetch];
};

export default useRoommateUsers;