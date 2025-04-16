import LoginForm from '@/components/auth/LoginForm'
import Head from 'next/head'

export default function Login() {
  
  return (
    <main>
      <Head>
        <title>Login</title>
      </Head>
     <LoginForm />
    </main>
  )
}
