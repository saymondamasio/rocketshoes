import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { api } from '../services/api'

const Home: NextPage = () => {
  const router = useRouter()

  async function handleClick() {
   await  api.post('/orders', {
	"cart": [
		{
			"product_id": "454fb7f2-4c5c-4465-9e7e-be3abd46e5bb",
			"quantity": 1,
			"unit_price": 5.60
		}
	],
	"delivery": {
		"address": {
			"street": "Rua",
			"number": "Numero",
			"neighborhood": "Bairro",
			"city": "Braga",
			"state": "PA",
			"zip_code": "37800000"
		},
		"deadline": "2022-02-26",
		"cost": 11610,
		"type": "SEDEX"
	},
	"payment": {
		"amount": 1000,
		"status": "PENDING"
	}
    }, {
      params: {
        store_id: 'f933715e-f646-4b9d-aa7a-3a2f5c677b9d'
      }
    })

    router.push('/payment')
  }

  return (
    <div>
      <button onClick={handleClick}>Fazer pedido</button>
    </div>
  )
}

export default Home
