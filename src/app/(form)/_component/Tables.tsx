// Tables.tsx

'use client'
import React, { useState } from 'react'
import { RecruitDTO, EducationDTO, CareerDTO, CertificateDTO } from '@/types/SpringBootReponse'
import Recruit from './Recruit'
import Education from './Education'
import Career from './Career'
import Certificate from './Certificate'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface RecruitProps {
  recruitVo: RecruitDTO
  cities: string[]
}

const Tables: React.FC<RecruitProps> = ({ recruitVo, cities }) => {
  const [recruitData, setRecruitData] = useState<RecruitDTO>(recruitVo)

  const validateData = (): boolean => {
    const { birth, email, addr, location, workType, educations, careers, certificates } = recruitData

    if (toast.isActive('validationError')) return false

    if (!birth) {
      showToastAndFocus('생년월일을 선택해 주세요.', 'birth')
      return false
    }

    if (!email || !validateEmail(email)) {
      showToastAndFocus('올바른 이메일 형식을 입력해 주세요.', 'email')
      return false
    }

    if (!addr) {
      showToastAndFocus('주소를 입력해 주세요.', 'addr')
      return false
    }

    if (!location || location === 'none') {
      showToastAndFocus('희망근무지를 선택해 주세요.', 'location')
      return false
    }

    if (!workType || workType === 'none') {
      showToastAndFocus('근무형태를 선택해 주세요.', 'workType')
      return false
    }

    const validatedEducations = educations?.filter((education, index) => {
      if (!education.startPeriod) {
        focusAndHighlightInvalidField('education', index, 'startPeriod')
        showToast('재학기간 시작일을 입력해 주세요.')
        return false
      }

      if (!education.endPeriod) {
        focusAndHighlightInvalidField('education', index, 'endPeriod')
        showToast('재학기간 종료일을 입력해 주세요.')
        return false
      }

      if (!education.schoolName) {
        focusAndHighlightInvalidField('education', index, 'schoolName')
        showToast('학교명을 입력해 주세요.')
        return false
      }

      if (!education.major) {
        focusAndHighlightInvalidField('education', index, 'major')
        showToast('전공을 입력해 주세요.')
        return false
      }

      const startDate = new Date(education.startPeriod)
      const endDate = new Date(education.endPeriod)

      if (startDate > endDate) {
        focusAndHighlightInvalidField('education', index, 'startPeriod')
        showToast('재학기간 시작일은 종료일보다 이전이어야 합니다.')
        return false
      }

      if (startDate > new Date() || endDate > new Date()) {
        focusAndHighlightInvalidField('education', index, 'startPeriod')
        showToast('재학기간은 과거여야 합니다.')
        return false
      }

      return true
    })

    const validatedCareers = careers?.filter((career, index) => {
      const hasData = career.startPeriod || career.endPeriod || career.compName || career.task
      if (!hasData) return false

      if (!career.startPeriod) {
        focusAndHighlightInvalidField('career', index, 'startPeriod')
        showToast('근무기간 시작일을 입력해 주세요.')
        return false
      }

      if (!career.endPeriod) {
        focusAndHighlightInvalidField('career', index, 'endPeriod')
        showToast('근무기간 종료일을 입력해 주세요.')
        return false
      }

      if (!career.compName) {
        focusAndHighlightInvalidField('career', index, 'compName')
        showToast('회사명을 입력해 주세요.')
        return false
      }

      if (!career.task) {
        focusAndHighlightInvalidField('career', index, 'task')
        showToast('부서/직급/직책을 입력해 주세요.')
        return false
      }

      const startDate = new Date(career.startPeriod)
      const endDate = new Date(career.endPeriod)

      if (startDate > endDate) {
        focusAndHighlightInvalidField('career', index, 'startPeriod')
        showToast('근무기간 시작일은 종료일보다 이전이어야 합니다.')
        return false
      }

      if (startDate > new Date() || endDate > new Date()) {
        focusAndHighlightInvalidField('career', index, 'startPeriod')
        showToast('근무기간은 과거여야 합니다.')
        return false
      }

      return true
    })

    const validatedCertificates = certificates?.filter((certificate, index) => {
      const hasData = certificate.qualifiName || certificate.acquDate || certificate.organizeName
      if (!hasData) return false // 빈 필드는 아예 제외

      if (!certificate.qualifiName) {
        focusAndHighlightInvalidField('certificate', index, 'qualifiName')
        showToast('자격증명을 입력해 주세요.')
        return false
      }

      if (!certificate.acquDate) {
        focusAndHighlightInvalidField('certificate', index, 'acquDate')
        showToast('취득일을 입력해 주세요.')
        return false
      }

      if (!certificate.organizeName) {
        focusAndHighlightInvalidField('certificate', index, 'organizeName')
        showToast('발행처를 입력해 주세요.')
        return false
      }

      const acquDate = new Date(certificate.acquDate)
      if (acquDate > new Date()) {
        focusAndHighlightInvalidField('certificate', index, 'acquDate')
        showToast('취득일은 과거여야 합니다.')
        return false
      }

      return true
    })

    setRecruitData((prevData) => ({
      ...prevData,
      educations: validatedEducations || [],
      careers: validatedCareers || [],
      certificates: validatedCertificates || [],
    }))

    return true
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const focusAndHighlightInvalidField = (
    section: string,
    index: number,
    field?: keyof EducationDTO | keyof CareerDTO | keyof CertificateDTO,
  ) => {
    const fieldId = field ? `${section}-${index}-${field}` : `${section}-${index}`
    const invalidField = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null

    if (invalidField) {
      invalidField.focus()
      invalidField.classList.add('outline-red-500', 'outline-2') // Tailwind CSS 스타일 적용
    }
  }

  const showToastAndFocus = (message: string, fieldId: string) => {
    toast.error(message, {
      toastId: 'validationError',
      onClose: () => {
        const field = document.getElementById(fieldId) as HTMLInputElement | HTMLSelectElement | null
        if (field) {
          field.focus()
          field.classList.add('outline-red-500', 'outline-2') // Tailwind CSS 스타일 적용
        }
      },
    })
  }

  const showToast = (message: string) => {
    toast.error(message, {
      toastId: 'validationError',
    })
  }

  const handleSave = async () => {
    if (!validateData()) return
    console.log(recruitData)
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <ToastContainer position='top-center' autoClose={3000} />
      <Recruit recruitData={recruitData} setRecruitData={setRecruitData} cities={cities} />
      <Education recruitData={recruitData} setRecruitData={setRecruitData} cities={cities} />
      <Career recruitData={recruitData} setRecruitData={setRecruitData} cities={cities} />
      <Certificate recruitData={recruitData} setRecruitData={setRecruitData} />
      <div className='flex justify-end mt-4 space-x-4'>
        <button
          type='button'
          onClick={handleSave}
          className={
            'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-md shadow-md transition-all duration-300 px-4 py-2'
          }>
          저장
        </button>
      </div>
    </div>
  )
}

export default Tables
