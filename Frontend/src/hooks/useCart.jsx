import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';

// Create a custom hook for fetching cart data
const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('access-token');

  // Use the useQuery hook from react-query to fetch cart data
  const { refetch, data: cart = [] } = useQuery({
    queryKey: ['carts', user?.email],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/carts?email=${user?.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: 'GET',
          }
        );
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
  });

  return [cart, refetch];
};

export default useCart;
