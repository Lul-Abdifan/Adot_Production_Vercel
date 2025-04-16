import Image from 'next/image'
import Link from 'next/link'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import Head from 'next/head'


export default function ForgotPassword() {
  return (
    <main>
      <Head>
        <title>Forgot Password</title>
      </Head>
     <ForgotPasswordForm />
    </main>
  )
}
