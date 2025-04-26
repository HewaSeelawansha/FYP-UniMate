import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const PayListing = ({ listing, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (typeof price !== 'number' || price < 1) {
      console.log("Price is not a number or less than 1");
      return;
    }
    axiosSecure.post('/create-payment-intent', { price })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      });
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || 'anonymous',
            email: user?.email || 'unknown'
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      const paymentInfo = {
        payStatus: "Done"
      };

      await axiosSecure.patch(`/listing/payment/${listing}`, paymentInfo);
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/owner/manage-items');
      }, 2000);
    }
    setProcessing(false);
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your listing is live now. Redirecting to manage listings...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-500 hover:text-green-600 mb-6 transition duration-200"
        >
          <IoIosArrowBack className="mr-2" /> Back to listings
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Payment Summary */}
            <div className="md:w-1/2 p-6 md:p-8 bg-emerald-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Listing Fee Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Listing fee:</span>
                  <span className="font-semibold">LKR {price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between pt-2">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    LKR {price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-3">Accepted Cards</h3>
                <div className="flex space-x-4">
                  <FaCcVisa className="text-3xl text-[#1A1F71]" />
                  <FaCcMastercard className="text-3xl text-[#EB001B]" />
                  <FaCcAmex className="text-3xl text-[#016FD0]" />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="md:w-1/2 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Information
                  </label>
                  <div className="border rounded-lg p-3">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                            fontFamily: '"Inter", sans-serif',
                          },
                          invalid: {
                            color: '#e53e3e',
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCreditCard className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">
                    Your payment is secured with 256-bit SSL encryption
                  </span>
                </div>

                {cardError && (
                  <div className="text-red-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {cardError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!stripe || processing}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                    processing ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'
                  } flex items-center justify-center`}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Pay LKR ${price.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayListing;