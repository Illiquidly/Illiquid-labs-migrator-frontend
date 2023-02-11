import terraUtils from 'utils/blockchain/terraUtils'
import { TxReceipt } from '../blockchain.interface'

async function execute(message: object): Promise<TxReceipt> {
	const randomEarthContract = 'terra1eek0ymmhyzja60830xhzm7k7jkrk99a60q2z2t'

	return terraUtils.postTransaction({
		contractAddress: randomEarthContract,
		message,
	})
}

export { execute }
