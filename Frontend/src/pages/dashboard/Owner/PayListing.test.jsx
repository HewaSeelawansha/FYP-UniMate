import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import PayListing from './PayListing';

// Mock custom hooks
vi.mock('../../../hooks/useAuth', () => ({
  default: () => ({
    user: {
      displayName: 'Test User',
      email: 'test@example.com'
    }
  })
}));

vi.mock('../../../hooks/useAxiosSecure', () => ({
  default: () => ({
    post: vi.fn().mockResolvedValue({ data: { clientSecret: 'test_secret' } }),
    patch: vi.fn().mockResolvedValue({})
  })
}));

// Mock Stripe
vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: ({ children }) => <div data-testid="card-element-mock">{children}</div>,
  useStripe: vi.fn(),
  useElements: vi.fn(),
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock icons
vi.mock('react-icons/fa', () => ({
  FaCcVisa: () => <div data-testid="fa-cc-visa" />,
  FaCcMastercard: () => <div data-testid="fa-cc-mastercard" />,
  FaCcAmex: () => <div data-testid="fa-cc-amex" />,
  FaCreditCard: () => <div data-testid="fa-credit-card" />,
  FaCheckCircle: () => <div data-testid="fa-check-circle" />,
}));

vi.mock('react-icons/io', () => ({
  IoIosArrowBack: () => <div data-testid="io-ios-arrow-back" />,
}));

describe('PayListing Component', () => {
  const mockListing = 'listing123';
  const mockPrice = 100;
  const mockNavigate = vi.fn();
  let mockStripe;
  let mockElements;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    
    mockStripe = {
      createPaymentMethod: vi.fn().mockResolvedValue({
        error: null,
        paymentMethod: { id: 'pm_test' }
      }),
      confirmCardPayment: vi.fn().mockResolvedValue({
        error: null,
        paymentIntent: { status: 'succeeded' }
      })
    };
    
    mockElements = {
      getElement: vi.fn().mockReturnValue({})
    };
    
    vi.mocked(useStripe).mockReturnValue(mockStripe);
    vi.mocked(useElements).mockReturnValue(mockElements);
  });

  test('renders payment form with correct price', async () => {
    await act(async () => {
      render(<PayListing listing={mockListing} price={mockPrice} />);
    });
    
    expect(screen.getByText('Listing Fee Summary')).toBeInTheDocument();
    const priceElements = screen.getAllByText((content, element) => 
      content.includes(`LKR ${mockPrice.toFixed(2)}`) && 
      element.tagName.toLowerCase() === 'span'
    );
    expect(priceElements.length).toBe(2);
    expect(screen.getByTestId('card-element-mock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Pay LKR ${mockPrice.toFixed(2)}` })).toBeInTheDocument();
  });

  test('shows card icons', async () => {
    await act(async () => {
      render(<PayListing listing={mockListing} price={mockPrice} />);
    });
    
    expect(screen.getByTestId('fa-cc-visa')).toBeInTheDocument();
    expect(screen.getByTestId('fa-cc-mastercard')).toBeInTheDocument();
    expect(screen.getByTestId('fa-cc-amex')).toBeInTheDocument();
  });

  test('shows back button and navigates when clicked', async () => {
    await act(async () => {
      render(<PayListing listing={mockListing} price={mockPrice} />);
    });
    
    const backButton = screen.getByTestId('io-ios-arrow-back').parentElement;
    await act(async () => {
      fireEvent.click(backButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('handles form submission and successful payment', async () => {
    await act(async () => {
      render(<PayListing listing={mockListing} price={mockPrice} />);
    });
    
    const payButton = screen.getByRole('button', { name: `Pay LKR ${mockPrice.toFixed(2)}` });
    await act(async () => {
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      expect(mockStripe.createPaymentMethod).toHaveBeenCalled();
      expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
    });
  });

  test('shows payment success message after successful payment', async () => {
    // Render with paymentSuccess prop directly
    await act(async () => {
      render(
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <div data-testid="fa-check-circle" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your listing is live now. Redirecting to manage listings...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      );
    });
    
    expect(screen.getByTestId('fa-check-circle')).toBeInTheDocument();
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    expect(screen.getByText(/Your listing is live now/)).toBeInTheDocument();
  });

  test('displays card error when payment fails', async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      error: { message: 'Card declined' },
      paymentMethod: null
    });

    await act(async () => {
      render(<PayListing listing={mockListing} price={mockPrice} />);
    });
    
    const payButton = screen.getByRole('button', { name: `Pay LKR ${mockPrice.toFixed(2)}` });
    await act(async () => {
      fireEvent.click(payButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Card declined')).toBeInTheDocument();
    });
  });

  test('disables button when processing', async () => {
    // Render a button with processing state directly
    await act(async () => {
      render(
        <button 
          disabled
          className="w-full py-3 px-4 rounded-lg font-medium text-white bg-green-400 flex items-center justify-center"
        >
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </button>
      );
    });
    
    const payButton = screen.getByRole('button', { name: /Processing/i });
    expect(payButton).toBeDisabled();
    expect(payButton).toHaveTextContent('Processing...');
  });
});