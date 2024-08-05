// Recruit.tsx

'use client'
import React, { forwardRef, useImperativeHandle } from 'react'
import { RecruitDTO } from '@/types/SpringBootReponse'
import { toast } from 'react-toastify'

interface RecruitProps {
  recruitData: RecruitDTO
  setRecruitData: React.Dispatch<React.SetStateAction<RecruitDTO>>
  cities: string[]
}

const Recruit = forwardRef((props: RecruitProps, ref) => {
  const { recruitData, setRecruitData, cities } = props

  const handleChange = (field: keyof RecruitDTO, value: string) => {
    setRecruitData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }
  // 부모에서 자식 컴포넌트내 함수에 접근하려면 해당 함수를 useImperativeHandle로 접근한다
  // 처음보는 훅..
  useImperativeHandle(ref, () => ({
    validate: () => {
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('#recruitForm input, #recruitForm select'),
      )

      for (const input of inputs) {
        if (input.value.trim() === '' || input.value.trim() === 'none') {
          input.focus()
          input.classList.add('outline-red-500', 'outline-2') // 입력 필드 강조

          const message = input.getAttribute('data-th-name')
          if (message) {
            toast.error(`${message}을(를) 입력해 주세요.`, {
              toastId: 'validationError',
            })
          }

          return false
        }
      }

      return true
    },
  }))

  return (
    <div className='bg-white shadow-md rounded-lg w-1/3 h-auto p-4'>
      <form id='recruitForm'>
        <input type='hidden' name='submitFlag' value={recruitData.submitFlag?.toString() || 'false'} />
        <input type='hidden' name='seq' value={recruitData.seq} />

        <div className='flex justify-between mb-1'>
          <div className='flex-1 mr-2'>
            <label htmlFor='name' className='text-gray-700 font-semibold block'>
              이름
            </label>
            <input
              type='text'
              defaultValue={recruitData.name}
              readOnly
              className='border border-gray-300 rounded-lg bg-gray-100 w-full h-9'
              data-th-name='이름'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='birth' className='text-gray-700 font-semibold block'>
              생년월일
            </label>
            <input
              type='date'
              defaultValue={recruitData.birth || ''}
              min='1960-01-01'
              max='2025-01-01'
              onChange={(e) => handleChange('birth', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='생년월일'
            />
          </div>
        </div>
        <div className='flex justify-between mb-1'>
          <div className='flex-1 mr-2'>
            <label htmlFor='gender' className='text-gray-700 font-semibold block'>
              성별
            </label>
            <select
              defaultValue={recruitData.gender || 'none'}
              onChange={(e) => handleChange('gender', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='성별'>
              <option value='none'>선택</option>
              <option value='남'>남</option>
              <option value='여'>여</option>
            </select>
          </div>
          <div className='flex-1'>
            <label htmlFor='phone' className='text-gray-700 font-semibold block'>
              연락처
            </label>
            <div className='flex space-x-1'>
              <select
                defaultValue={recruitData.phone.substring(0, 3) || 'none'}
                disabled
                className='border border-gray-300 rounded-lg w-1/3 h-9 bg-gray-100'
                data-th-name='연락처 앞자리'>
                <option>선택</option>
                <option value='010'>010</option>
                <option value='011'>011</option>
                <option value='016'>016</option>
                <option value='017'>017</option>
                <option value='018'>018</option>
                <option value='019'>019</option>
              </select>
              <input
                type='text'
                maxLength={4}
                pattern='[0-9]{3,4}'
                placeholder='xxxx'
                defaultValue={recruitData.phone.substring(3, 7)}
                readOnly
                className='border border-gray-300 rounded-lg w-1/3 h-9 bg-gray-100'
                title='4자리 숫자를 입력해주세요'
                aria-label='전화번호 중간자리'
                data-th-name='연락처 중간자리'
              />
              <input
                type='text'
                maxLength={4}
                pattern='[0-9]{4}'
                placeholder='xxxx'
                defaultValue={recruitData.phone.substring(7)}
                readOnly
                className='border border-gray-300 rounded-lg w-1/3 h-9 bg-gray-100'
                title='4자리 숫자를 입력해주세요'
                aria-label='전화번호 끝자리'
                data-th-name='연락처 끝자리'
              />
            </div>
          </div>
        </div>

        <div className='flex justify-between mb-1'>
          <div className='flex-1 mr-2'>
            <label htmlFor='email' className='text-gray-700 font-semibold block'>
              Email
            </label>
            <input
              type='text'
              defaultValue={recruitData.email || ''}
              placeholder='이메일을 입력해주세요'
              onChange={(e) => handleChange('email', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='Email'
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='addr' className='text-gray-700 font-semibold block'>
              주소
            </label>
            <input
              type='text'
              defaultValue={recruitData.addr || ''}
              placeholder='도로명 주소를 입력해주세요'
              onChange={(e) => handleChange('addr', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='주소'
            />
          </div>
        </div>

        <div className='flex justify-between mb-1'>
          <div className='flex-1 mr-2'>
            <label htmlFor='location' className='text-gray-700 font-semibold block'>
              희망근무지
            </label>
            <select
              defaultValue={recruitData.location || 'none'}
              onChange={(e) => handleChange('location', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='희망근무지'>
              <option value='none'>선택</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label htmlFor='workType' className='text-gray-700 font-semibold block'>
              근무형태
            </label>
            <select
              defaultValue={recruitData.workType || 'none'}
              onChange={(e) => handleChange('workType', e.target.value)}
              className='border border-gray-300 rounded-lg w-full h-9 focus:outline-none'
              data-th-name='근무형태'>
              <option value='none'>선택</option>
              <option value='정규직'>정규직</option>
              <option value='계약직'>계약직</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
})

export default Recruit
