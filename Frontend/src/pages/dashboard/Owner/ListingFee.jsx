import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PayListing from './PayListing';
import { useLocation } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const ListingFee = () => {
  const location = useLocation();

  const { Listing, Fee } = location.state || { Listing: 'Not Specified', Fee: 0 };
  const Fees = parseFloat(Fee.toFixed(2));

  return (
    <div className='section-container py-20'>
      <Elements stripe={stripePromise}>
            <PayListing listing={Listing} price={Fees}/>
      </Elements>
    </div>
  )
}

export default ListingFee
