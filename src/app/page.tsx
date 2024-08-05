import type { Metadata } from 'next'
import FormComponent from '@/app/(login)/_components/loginForm'

export const metadata: Metadata = {
  title: 'WELCOME TO OUR COMPANY',
  description: 'THIS IS OUR FIRST PAGE TO SIGN IN',
}

export const revalidate = Infinity

const Home = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center min-h-screen w-full bg-gray-100'>
        <div className='flex flex-col justify-center items-center bg-white shadow-xl rounded-lg p-8 w-full max-w-sm'>
          <h1 className='text-2xl font-semibold mb-6 text-gray-800'>로그인</h1>
          <FormComponent />
        </div>
      </div>
    </>
  )
}

export default Home
