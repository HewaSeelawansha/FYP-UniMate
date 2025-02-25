import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
//import useCart from '../../hooks/useCart';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
  //const [cart] = useCart();
  //console.log(cart)
  // calculate the total amount
  const cart = 10;
  const cartTotal = 100;
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
