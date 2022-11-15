const fallbackIPFSUrls = [
	'https://d1mx8bduarpf8s.cloudfront.net/',
	'https://ipfs.fleek.co/ipfs/',
	'https://ipfs.io/ipfs/',
	'https://cloudflare-ipfs.com/ipfs/',
]

export function fromIPFSImageURLtoImageURL(originUrl?: string): string[] {
	// We modify the Lootopian URLS
	const newUrl = (originUrl ?? '').replace(
		'https://lootopia-api.spacedollars.money/',
		'http://116.203.178.76:8080/'
	)

	return fallbackIPFSUrls.map(ipfsUrl =>
		encodeURI((newUrl || '').replace('ipfs://', ipfsUrl))
	)
}
