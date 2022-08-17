import client from 'axios'

export const baseURL = 'https://api.illiquidly.io:8443/'

export const axios = client.create({
	baseURL,
})

export const migratorURL = 'https://api.illiquidly.io:8444/'

export const migratorClient = client.create({
	baseURL: migratorURL,
})

export const migratorCacheURL = 'https://api.illiquidly.io:8445/'

export const migratorCacheClient = client.create({
	baseURL: migratorCacheURL,
})
