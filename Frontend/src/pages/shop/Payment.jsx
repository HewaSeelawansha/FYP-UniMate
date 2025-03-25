import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
  const cartTotal = 15000;
  const totalPrice = parseFloat(cartTotal.toFixed(2));
  const totalItems = 10;

  return (
    <div className='section-container py-20'>
      <Elements stripe={stripePromise}>
            <CheckoutForm price={totalPrice} cart={totalItems}/>
      </Elements>
    </div>
  )
}

export default Payment
