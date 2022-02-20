import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../../hooks/useCart'

export function InfoShipping() {
  const { shipping, addShippingAddress, createOrder, order } = useCart()
  const [zipCode, setZipCode] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [completed, setCompleted] = useState(false)

  const submitAddressShipping = async (e: FormEvent) => {
    e.preventDefault()
    const address = {
      zipCode,
      street,
      number,
      complement,
      city,
      state,
    }
    console.log({
      zipCode,
      street,
      number,
      complement,
      city,
      state,
    })

    if (zipCode && street && number && city && state) {
      addShippingAddress(address)
      createOrder()
      setCompleted(true)
      toast.success('Endereço de entrega cadastrado com sucesso!')
    }
  }

  return (
    <div>
      {completed && shipping.address ? (
        <div>
          <p>
            {shipping.address.street}, {shipping.address.number}
          </p>
          <p>
            {shipping.address.city} - {shipping.address.state}
          </p>
          <p>{shipping.address.zipCode}</p>
        </div>
      ) : (
        <form onSubmit={submitAddressShipping}>
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Digite sua rua"
            value={street}
            onChange={e => setStreet(e.target.value)}
          />
          <input
            type="text"
            placeholder="Digite seu numero"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Digite complemento"
            value={complement}
            onChange={e => setComplement(e.target.value)}
          />
          <input
            type="text"
            placeholder="Digite seu estado"
            value={state}
            onChange={e => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Digite sua cidade"
            value={city}
            onChange={e => setCity(e.target.value)}
          />

          <button type="submit">Ir para pagamento</button>
        </form>
      )}
    </div>
  )
}
