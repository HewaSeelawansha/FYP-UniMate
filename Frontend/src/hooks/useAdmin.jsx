import React from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const {user, loading} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { refetch, data: isAdmin, isPending: isAdminLoading} = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        queryFn: async () => {
            const res = await axiosSecure.get(`users/admin/${user?.email}`)
            return res.data?.admin;
        },
        enabled: !loading && !!user?.email
    })
  
    return [isAdmin, isAdminLoading]
}

export default useAdmin;

