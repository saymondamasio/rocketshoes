import { Elements } from '@stripe/react-stripe-js'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CheckoutForm } from '../components/CheckForm'
import { api } from '../services/api'
import { getStripeClient } from '../services/stripe-client'

const Payment: NextPage = () => {
  const [clientSecret, setClientSecret] = useState('')

  const stripe = getStripeClient()

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    api
      .post<any>(`payments/create-intent/${''}`)
      .then(response => setClientSecret(response.data.client_secret))
  }, [])

  return (
    <div className="App">
      {clientSecret && (
        <Elements
          options={{
            appearance: { theme: 'stripe' },
            clientSecret,
          }}
          stripe={stripe}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default Payment
