import axios from 'axios'
import { keysToCamel } from 'utils/js/keysToCamel'

interface Traits {
	hat: string
	base: string
	eyes: string
	mouth: string
	clothes: string
	background: string
}

interface RawTrait {
	value: string
	traitType: string
}
interface Item {
	type: string
	createdAt: string
	updatedAt: string
	tokenId: string
	collectionAddr: string
	userAddr: string
	inSettlement: boolean
	src: string
	imageData: any
	externalUrl: any
	description: string
	name: string
	traits: Traits
	rawTraits: RawTrait[]
	backgroundColor: any
	animationUrl: any
	youtubeUrl: any
	kind: string
	lastTradePrice: any
	likesCount: any
	price: any
	bid: any
	acceptingCounters: any
	listingTime: number
	slug: string
	burned: boolean
	rarity: number
}

export class RandomEarthService {
	static async getAllUsersNFTs(userAddress?: string): Promise<Item[]> {
		let page = 1
		let pages = 1
		const items = []

		do {
			// eslint-disable-next-line no-await-in-loop
			const apiResponse = await axios.get(
				`https://randomearth.io/api/items?user_addr=${userAddress}&collection_addr=&page=${page}`
			)

			pages = apiResponse.data.pages

			page += 1

			items.push(keysToCamel(apiResponse?.data?.items ?? []) as never)
		} while (page < pages)

		return items.flat()
	}
}
