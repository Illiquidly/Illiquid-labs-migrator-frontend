import client from 'axios'

export const baseURL = 'https://api.illiquidlabs.io/old'

export const axios = client.create({
	baseURL,
})
