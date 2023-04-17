import { MainContainer } from 'components/ui/Container/Container'
import Image from 'next/image'
import {
	MigratorImageContainer,
	Title,
	TitleContainer,
	ToastLink,
} from 'pages/migrate/index.styled'
import React, { useState } from 'react'
import { Box, Flex } from 'rebass'
import migratorAnimation from 'theme/assets/migrator.gif'
import { Label, Textarea } from 'theme-ui'
import { Button } from 'components/ui/Button/Button'
import { asyncAction } from 'utils/js/asyncAction'
import { toast } from 'react-toastify'
import useBroadcastingTx from 'hooks/useBroadcastingTx'
import { noop } from 'lodash'
import { TxReceipt } from 'services/blockchain/blockchain.interface'
import { useRecoilState } from 'recoil'
import { appLoadingState } from 'state'
import useTransactionError from 'hooks/useTransactionError'
import terraUtils from 'utils/blockchain/terraUtils'

const renderToastContent = ({ url }: { url?: string }) => (
	<div>
		<Box marginRight={4}>Your command successfully executed.</Box>
		<ToastLink href={url} target='_blank' rel='noreferrer'>
			Open in Terra Finder
		</ToastLink>
	</div>
)

export default function Withdrawer() {
	const [txReceipt, setTxReceipt] = React.useState<TxReceipt | null>(null)
	const [message, setMessage] = useState('')

	const [contractAddress, setContractAddress] = useState(
		'terra1eek0ymmhyzja60830xhzm7k7jkrk99a60q2z2t'
	)

	const [showTransactionError] = useTransactionError()

	const [, setAppLoading] = useRecoilState(appLoadingState)

	const onSuccessBroadcast = async () => {
		toast.success(renderToastContent({ url: txReceipt?.txTerraFinderUrl }), {
			position: 'top-right',
			autoClose: false,
			onClick: noop,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: false,
			draggable: false,
			progress: undefined,
			pauseOnFocusLoss: false,
		})

		setAppLoading(false)
	}

	const { setLoading, loading } = useBroadcastingTx(
		txReceipt?.txId,
		onSuccessBroadcast
	)

	const executeMessage = async () => {
		setAppLoading(true)
		setLoading({ ...loading, send: true })
		const [error, txResponse] = await asyncAction(
			terraUtils.postTransaction({
				contractAddress,
				message: JSON.parse(message),
			})
		)

		if (txResponse) {
			setTxReceipt(txResponse)
		}
		if (error) {
			showTransactionError(error)
			setAppLoading(false)
		}
		setLoading({ ...loading, send: false })
	}

	return (
		<MainContainer>
			<Flex width='100%' flexDirection='column'>
				<Flex alignItems='center' justifyContent='center' marginLeft={[-2, 0]}>
					<MigratorImageContainer>
						<Image
							unoptimized
							priority
							objectFit='contain'
							src={migratorAnimation}
							alt=''
						/>
					</MigratorImageContainer>
				</Flex>
				<TitleContainer>
					<Flex sx={{ mt: '24px' }}>
						<Flex justifyContent='center' alignItems='center' p={0}>
							<Title>Execute Contract</Title>
						</Flex>
					</Flex>
				</TitleContainer>
				<Flex sx={{ mt: '24px', flexDirection: 'column', gap: '4px' }}>
					<Label>Contract Address:</Label>
					<Textarea
						rows={1}
						value={contractAddress}
						onChange={e => setContractAddress(e.target.value)}
					/>
				</Flex>
				<Flex sx={{ mt: '24px', flexDirection: 'column', gap: '4px' }}>
					<Label>Message:</Label>
					<Textarea
						rows={10}
						value={message}
						onChange={e => setMessage(e.target.value)}
					/>
				</Flex>

				<Flex sx={{ mt: '24px' }}>
					<Button onClick={executeMessage}>Execute</Button>
				</Flex>
			</Flex>
		</MainContainer>
	)
}
