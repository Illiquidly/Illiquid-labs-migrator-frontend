import { TxReceipt } from 'services/blockchain/blockchain.interface'

import terraUtils from 'utils/blockchain/terraUtils'

import pMemoize from 'p-memoize'
import type { TransactionDetails } from 'utils/blockchain/terraUtils'
import { NFT } from 'pages/migrate/components/NFTPreviewCard/NFTPreviewCard'

const LIMIT = 30

export interface NFTWithRecipient {
	nftAddress: string
	tokenId: string
	recipient: string
}

async function transferToken(
	nftContractAddress: string,
	tokenId: string,
	userAddress: string
): Promise<TxReceipt> {
	return terraUtils.postTransaction({
		contractAddress: nftContractAddress,
		message: {
			transfer_nft: {
				token_id: tokenId,
				recipient: userAddress,
			},
		},
	})
}

// Those functions however do not reduce gas costs.
async function transferMultipleToken(
	nfts: NFTWithRecipient[]
): Promise<TxReceipt> {
	const txs: TransactionDetails[] = nfts
		.map(nft => ({
			contractAddress: nft.nftAddress,
			message: {
				transfer_nft: {
					token_id: nft.tokenId,
					recipient: nft.recipient,
				},
			},
		}))
		.filter(nft => nft.contractAddress)
	return terraUtils.postManyTransactions(txs)
}

// Those functions however do not reduce gas costs.
async function singleMultisender(
	recipient: string,
	nfts: NFT[]
): Promise<TxReceipt> {
	const txs: TransactionDetails[] = nfts.map(cw721 => ({
		contractAddress: cw721.contractAddress,
		message: {
			transfer_nft: {
				token_id: cw721.tokenId,
				recipient,
			},
		},
	}))
	return terraUtils.postManyTransactions(txs)
}

// async function getTokensOnWalletForUser() {
// 	const nftCollections = await getRegisteredCollections()
// 	const nftAddresses = nftCollections.map(
// 		collection => collection.nftContractAddress
// 	)
// 	const userAddress = await terraUtils.getWalletAddress()

// 	const allTokensOnWallet = []

// 	for (const nftAddress of nftAddresses) {
// 		try {
// 			const collectionMetadata = await fetchCollectionMetadata(nftAddress)
// 			const tokens = await getTokensOwnedByUser(
// 				nftAddress,
// 				userAddress,
// 				collectionMetadata
// 			)
// 			allTokensOnWallet.push(...tokens)
// 		} catch (e) {
// 			console.warn(e)
// 		}
// 	}

// 	return allTokensOnWallet
// }

// async function getTokensOwnedByUser(
// 	nftContractAddress: string,
// 	userAddress: string,
// 	collectionMetadata: CollectionMetadata
// ): Promise<NFTTokenDetails[]> {
// 	const tokenIds = await getTokenIdsOwnedByUser(nftContractAddress, userAddress)
// 	const tokens = []

// 	for (const tokenId of tokenIds) {
// 		const tokenDetails = collectionMetadata[tokenId]
// 		tokenDetails.nftContractAddress = nftContractAddress
// 		tokens.push(tokenDetails)
// 	}

// 	return tokens
// }

async function getTokenIdsOwnedByUserWithOffset(
	nftContractAddress: string,
	userAddress: string,
	startAfterTokenId?: string
): Promise<string[]> {
	// console.log(nftContractAddress);
	// console.log(userAddress);

	const response = await terraUtils.sendQuery(nftContractAddress, {
		tokens: {
			limit: LIMIT,
			owner: userAddress,
			start_after: startAfterTokenId,
		},
	})

	// Unstables: Guardians of Terra returns different data
	if (response.tokens?.[0]?.token_id) {
		return response.tokens.map((token: any) => token.token_id)
	}

	return response.tokens
}

async function getTokensOwnedByUserCountInCollection(
	nftContractAddress: string
): Promise<number> {
	const userAddress = await terraUtils.getWalletAddress()

	const tokenIds = await getTokenIdsOwnedByUserWithOffset(
		nftContractAddress,
		userAddress
	)

	return tokenIds ? tokenIds.length : 0
}

async function getOwnerOfToken(
	nftContractAddress: string,
	tokenId: string
): Promise<string> {
	const response = await terraUtils.sendQuery(nftContractAddress, {
		owner_of: {
			token_id: tokenId,
		},
	})

	return response.owner
}

interface ContractInfo {
	name: string
}

async function getContractInfo(
	nftContractAddress: string
): Promise<ContractInfo> {
	const { name } = await terraUtils.sendQuery(nftContractAddress, {
		contract_info: {},
	})

	return {
		name,
	}
}

async function getNFTInfo(
	nftContractAddress: string,
	tokenId: string
): Promise<any> {
	return terraUtils.sendQuery(nftContractAddress, {
		nft_info: {
			token_id: tokenId,
		},
	})
}

const memoizedGetContractInfo = pMemoize(getContractInfo)

const memoizedGetNFTInfo = pMemoize(getNFTInfo, {
	cacheKey: args => JSON.stringify(args),
})

export default {
	// getTokensOnWalletForUser,
	getTokensOwnedByUserCountInCollection,
	getOwnerOfToken,
	transferToken,
	transferMultipleToken,
	singleMultisender,
	getContractInfo,
	getNFTInfo,
	memoizedGetContractInfo,
	memoizedGetNFTInfo,
}
