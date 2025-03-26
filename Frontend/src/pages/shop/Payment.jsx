import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
  const location = useLocation();

  const { Rent, KeyMoney, Listing, Booking } = location.state || { Rent: 0, KeyMoney: 0, Listing: 'Not Specified', Booking: 'Not Specified' };
  const Rental = parseFloat(Rent.toFixed(2));
  const Key = parseFloat(KeyMoney.toFixed(2));

  return (
    <div className='section-container py-20'>
      <Elements stripe={stripePromise}>
            <CheckoutForm booking={Booking} listing={Listing} price={Rental} keyMoney={Key}/>
      </Elements>
    </div>
  )
}

export default Payment
