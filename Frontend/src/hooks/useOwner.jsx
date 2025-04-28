import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useOwner = () => {
    const {user, loading} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { refetch, data: isOwner, isPending: isOwnerLoading} = useQuery({
        queryKey: [user?.email, 'isOwner'],
        queryFn: async () => {
            const res = await axiosSecure.get(`users/owner/${user?.email}`)
            return res.data?.owner;
        },
        enabled: !loading && !!user?.email
    })
    return [isOwner, isOwnerLoading]
}

export default useOwner;