import { AppProps } from 'next/app'
import '../styles/global.scss';
import { Provider as SessionProvider }  from 'next-auth/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Header } from '../Components/Header';
//Produção: AXKyBzUdPZyKzY0L7JZlqCVKcQTM0UfQa5jcOIbNKNwMtVbf8lstH0ZZasZKj2NSRazGbe84B3nURcPo
//teste: AUgWmEfZVwpBxGRlPFacIWUprVpEp-_hNmSSTjJMfGoe3-9IaJRnRDoMKpnF6mqGW0XpJ8h4K4HzzxVr
function MyApp({ Component, pageProps }: AppProps) {

  const initialOpations = {
    "client-id": 'AXKyBzUdPZyKzY0L7JZlqCVKcQTM0UfQa5jcOIbNKNwMtVbf8lstH0ZZasZKj2NSRazGbe84B3nURcPo',
    currency:"BRL",
    intent:"capture"
  }

  return (
    <SessionProvider
    session={pageProps.session}
    >
      <PayPalScriptProvider options={initialOpations}>
        <Header/>
        <Component {...pageProps} />
    </PayPalScriptProvider>
    </SessionProvider>
  )
}

export default MyApp
