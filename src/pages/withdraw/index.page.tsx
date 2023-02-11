import { MainContainer } from 'components/ui/Container/Container'
import Image from 'next/image'
import {
	MigratorImageContainer,
	Title,
	TitleContainer,
} from 'pages/migrate/index.styled'
import React, { useState } from 'react'
import { Flex } from 'rebass'
import migratorAnimation from 'theme/assets/migrator.gif'
import { Textarea } from 'theme-ui'
import { Button } from 'components/ui/Button/Button'
import { execute as randomEarthExecute } from 'services/blockchain/contracts/randomEarth'

export default function Withdrawer() {
	const [message, setMessage] = useState('')

	const executeMessage = async () => {
		await randomEarthExecute(JSON.parse(message))
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
							<Title>Terra Classic RE Withdraw</Title>
						</Flex>
					</Flex>
				</TitleContainer>
				<Flex sx={{ mt: '24px' }}>
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
