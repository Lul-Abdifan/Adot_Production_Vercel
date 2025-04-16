import Image from 'next/image'
import Link from 'next/link'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import Head from 'next/head'


export default function ResetPassword() {
  return (
    <main>
      <Head>
        <title>Reset Password</title>
      </Head>
     <ResetPasswordForm />
    </main>
  )
}
