'use client'
import { submitLogin, fetchUserInfo } from '@/api/login/login'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const FormComponent = () => {
  const router = useRouter()
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  
  

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = nameRef.current?.value || ''
    const phone = phoneRef.current?.value || ''

    // 입력값 검증
    if (validateInputs(name, phone)) {
      try {
        const response = await submitLogin({ name, phone })
        if (response) {
          toast.success(response.message || '로그인에 성공했습니다!')
          router.push(`/form?seq=${response}`)
        }
      } catch (error: any) {
        toast.error(error.message || '로그인 중 오류가 발생했습니다.')
      }
    }
  }

  const validateInputs = (name: string, phone: string): boolean => {
    if (/[^a-zA-Z가-힣\s]/.test(name)) {
      toast.error('이름에는 문자만 입력할 수 있습니다.')
      return false
    }
    if (/[^0-9]/.test(phone) || phone.length > 11) {
      toast.error('휴대폰번호는 최대 11자리의 숫자만 입력할 수 있습니다.')
      return false
    }
    return true
  }

  return (
    <div>
      <ToastContainer position='top-center' autoClose={3000} />
      <form className='flex flex-col space-y-4 w-full' onSubmit={handleFormSubmit}>
        <div className='flex flex-col'>
          <label className='text-gray-700 mb-1' htmlFor='name'>
            이름
          </label>
          <input
            ref={nameRef}
            type='text'
            id='name'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-200'
            placeholder='이름을 입력하세요'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-gray-700 mb-1' htmlFor='phone'>
            휴대폰번호
          </label>
          <input
            ref={phoneRef}
            type='text'
            id='phone'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition duration-200'
            placeholder='휴대폰번호를 입력하세요'
            maxLength={11}
            
          />
        </div>
        <button
          type='submit'
          className='flex justify-center items-center h-12 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200'>
          입사지원
        </button>
      </form>
    </div>
  )
}

export default FormComponent
