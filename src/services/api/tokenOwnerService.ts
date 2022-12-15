import promiseRetry from 'promise-retry'
import { axios } from 'services/axios'
import { keysToCamel } from 'utils/js/keysToCamel'

export class TokenOwnerService {
	static async getOwnerOf(
		network: string,
		contractAddress: string,
		tokenId: string
	) {
		const apiResponse = await promiseRetry(
			{ minTimeout: 200, retries: 5, factor: 2, randomize: true },
			async retry =>
				axios
					.get(`/cache/${network}/owner/${contractAddress}/tokenId/${tokenId}`)
					.catch(retry)
		)
		return keysToCamel(apiResponse.data)
	}

	static async getAllOwners(network: string, contractAddress?: string) {
		const apiResponse = await promiseRetry(
			{ minTimeout: 200, retries: 5, factor: 2, randomize: true },
			async retry =>
				axios
					.get(`/cache/${network}/all_tokens/${contractAddress || ''}`)
					.catch(retry)
		)
		return keysToCamel(apiResponse.data)
	}
}
