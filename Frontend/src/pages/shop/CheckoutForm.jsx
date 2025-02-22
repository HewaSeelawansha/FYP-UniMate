import React, { useEffect, useState } from 'react';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {FaCcVisa, FaPaypal, FaSnowboarding} from 'react-icons/fa'
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({price, cart}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState("");

  useEffect(()=>{
    if(typeof price !== 'number' || price < 1 || price == 'Invalid integer') {
        console.log("Price is not a number or less than 1")
        return;
    }
    axiosSecure.post('/create-payment-intent', {price})
    .then( res => {
        console.log(res.data.clientSecret)
        setClientSecret(res.data.clientSecret)
    })
  },[price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
      // create a new card element
      const card = elements.getElement(CardElement);

      if (card == null) {
        return;
      }
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
  
      if (error) {
        console.log('[error]', error);
        setCardError(error.message);
      } else {
        setCardError("success!");
        //console.log('[PaymentMethod]', paymentMethod);
      }

      const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.displayName || 'anonymous',
              email: user?.email || 'unknown'
            },
          },
        });
      if (confirmError) {
        console.log(confirmError)
        alert('Failed to confirm payment');
      }
      console.log(paymentIntent);
      if (paymentIntent.status === 'succeeded') {
        console.log(paymentIntent.id)
        setCardError(`Your Transaction ID is ${paymentIntent.id}`)
        // payment info
        const paymentInfo = {
            email: user.email,
            transactionId: paymentIntent.id,
            price,
            quantity: cart,
            status: "Order Processing",
            itemName: "Order Processing",
            cartItems: "Order Processing",
            menuItems: "Order Processing",
            //itemName: carts.map(item => item.name),
            //cartItems: carts.map(item => item._id),
            //menuItems: carts.map(item => item.menuItemId)
        }
        console.log(paymentInfo);
        // sent to backend
        axiosSecure.post('/payments', paymentInfo)
        .then(res => {
          console.log(res.data);
          alert('All Done');
          navigate('/order')
        });
      }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
      {/* left */}
      <div className='md:w-1/2 w-full space-y-3'>
        <h4 className='text-green text-lg font-semibold'>
            Order Summary
        </h4>
        <p>Number of Items: <span  className='font-semibold'>{cart}</span></p>
        <p>Subtotal: <span  className='font-semibold'>${price}</span></p>
      </div>
      {/* right */}
      <div className='md:w-1/3 px-4 py-8 card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl space-y-5'>
        <h4 className='text-green text-lg font-semibold'>
                Order Summary
        </h4>
        <h5><span  className='font-medium'>Credit/Debit </span>Card</h5>
        {/* stripe */}
        <form onSubmit={handleSubmit}>
        <CardElement
            options={{
            style: {
                base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                },
                invalid: {
                color: '#9e2146',
                },
            },
            }}
        />
        <button className='btn btn-sm w-full mt-5 bg-indigo-500 text-white' type="submit" disabled={!stripe}>
            Pay
        </button>
        </form>
        {
            cardError ? <p className='items-center flex justify-center font-mono text-red'><FaCcVisa/><span> : </span> {cardError}</p> : ""
        }
        {/* paypal */}
        <div className='mt-5 text-center'>
            <hr/>
            <button className='btn w-full btn-sm mt-5 bg-orange-500 text-white' type="submit">
            <FaPaypal/> Pay with Paypal
            </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm

