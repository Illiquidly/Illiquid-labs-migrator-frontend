import {
	CreateTxFailed,
	Timeout,
	TxFailed,
	TxUnspecifiedError,
	UserDenied,
} from '@terra-money/use-wallet'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { amountConverter } from 'utils/blockchain/terraUtils'

export default function useTransactionError() {
	const processErrorMessage = message => {
		const coins = [...message.matchAll(/(\s+)([0-9]+)(u[a-zA-Z]+)/g)]
		let processedMessage = message
		coins.forEach(([toReplace, , amount, denom]) => {
			processedMessage = processedMessage.replace(
				toReplace,
				` ${Number(amountConverter.ust.blockchainValueToUserFacing(amount)).toFixed(
					3
				)} ${denom.substring(1)}`
			)
		})

		return processedMessage
	}
	function parseError(error: AxiosError<{ message?: string }>) {
		if (error instanceof UserDenied) {
			return 'User Denied'
		}
		if (error instanceof CreateTxFailed) {
			return processErrorMessage(`Create Tx Failed: ${error.message}`)
		}
		if (error instanceof TxFailed) {
			return processErrorMessage(`Tx Failed: ${error.message}`)
		}
		if (error instanceof Timeout) {
			return 'Timeout'
		}
		if (error instanceof TxUnspecifiedError) {
			return processErrorMessage(`Unspecified Error: ${error.message}`)
		}

		if (error?.response?.data?.message) {
			return processErrorMessage(error.response.data.message)
		}

		return `Unknown Error: ${
			error instanceof Error ? error.message : String(error)
		}`
	}

	const showTransactionError = (error: AxiosError<{ message?: string }>) => {
		toast.warn(parseError(error), {
			position: 'top-right',
			autoClose: 5500,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: false,
			draggable: false,
			progress: undefined,
			pauseOnFocusLoss: false,
		})
	}

	return [showTransactionError]
}
