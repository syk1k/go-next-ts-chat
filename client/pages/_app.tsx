import AuthContextProvider from '@/modules/auth_provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
	return <>
		<AuthContextProvider>
			<div className='flex flex-col md:flex-row h-full min-h-screeen font-sans'>
				<Component {...pageProps} />
			</div>
		</AuthContextProvider>
	</>
}
