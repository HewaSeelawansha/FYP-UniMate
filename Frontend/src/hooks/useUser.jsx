import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    if (!user?.email) {
        return [null, false];
    }

    const { refetch, data: isUser, isLoading: isUserLoading } = useQuery({
        queryKey: [user.email, 'isUser'],
        queryFn: async () => {
            const res = await axiosSecure.get(`users/user/${user.email}`);
            return res.data?.user;
        },
        enabled: !!user?.email, 
    });

    return [isUser, isUserLoading];
};

export default useUser;