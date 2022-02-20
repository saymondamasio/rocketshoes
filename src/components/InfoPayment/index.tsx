import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { api } from '../../services/api'
import { getStripeClient } from '../../services/stripe-client'
import { CheckoutForm } from '../CheckForm'

export function InfoPayment() {
  const stripe = getStripeClient()
  const { order } = useCart()
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (order.id)
      api
        .post<any>(`payments/create-intent/${order.id}`)
        .then(response => setClientSecret(response.data.client_secret))
  }, [order.id])

  return (
    <div>
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
