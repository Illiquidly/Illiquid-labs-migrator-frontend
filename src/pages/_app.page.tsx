import './styles.css'
import 'react-toastify/dist/ReactToastify.css'
import 'rc-tooltip/assets/bootstrap_white.css'
import '@djthoms/pretty-checkbox'
import {
	getChainOptions,
	StaticWalletProvider,
	WalletControllerChainOptions,
	WalletProvider,
} from '@terra-money/wallet-provider'
import { useWallet } from '@terra-money/use-wallet'
import { AppProps } from 'next/app'
import React from 'react'
import { theme } from 'components/theme'
import { ThemeProvider } from 'theme-ui'
import blockchain from 'utils/blockchain/terraUtils'
import { RecoilRoot } from 'recoil'

import dynamic from 'next/dynamic'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextComponentType, NextPageContext } from 'next/types'
import {
	MainContentContainer,
	MainLayoutContainer,
} from 'components/ui/Container/Container'
import { ToastContainer } from 'components/ui/Toast/Toast.styled'
import Head from 'next/head'

const Header = dynamic(() => import('../components/ui/Header/Header'), {
	ssr: false,
})

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

const Main = ({
	Component,
	pageProps,
}: {
	Component: NextComponentType<NextPageContext, any, {}>
	pageProps: any
}) => {
	const wallet = useWallet()

	blockchain.setWallet(wallet)

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
				/>
				<title>Illiquid Labs | NFT Infrastructure</title>
			</Head>

			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<RecoilRoot>
						<MainLayoutContainer>
							<Header />
							<MainContentContainer>
								<Component {...pageProps} />
							</MainContentContainer>
						</MainLayoutContainer>
						<ToastContainer
							theme='dark'
							position='top-right'
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>
					</RecoilRoot>
				</ThemeProvider>
			</QueryClientProvider>
		</>
	)
}
export default function App({
	Component,
	defaultNetwork,
	walletConnectChainIds,
	pageProps,
}: AppProps & WalletControllerChainOptions) {
	return typeof window !== 'undefined' ? (
		<WalletProvider
			defaultNetwork={defaultNetwork}
			walletConnectChainIds={walletConnectChainIds}
		>
			<Main {...{ Component, pageProps }} />
		</WalletProvider>
	) : (
		<StaticWalletProvider defaultNetwork={defaultNetwork}>
			<Main {...{ Component, pageProps }} />
		</StaticWalletProvider>
	)
}

App.getInitialProps = async () => {
	const chainOptions = await getChainOptions()
	return {
		...chainOptions,
	}
}
