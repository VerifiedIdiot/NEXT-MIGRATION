'use client'
import React, { useEffect } from 'react'
import { RecruitDTO, EducationDTO } from '@/types/SpringBootReponse'

interface EducationProps {
  recruitData: RecruitDTO
  setRecruitData: React.Dispatch<React.SetStateAction<RecruitDTO>>
  cities: string[]
}

const Education: React.FC<EducationProps> = ({ recruitData, setRecruitData, cities }) => {
  const handleChange = (index: number, field: keyof EducationDTO, value: string) => {
    const updatedEducations = recruitData.educations?.map((education, idx) =>
      idx === index ? { ...education, [field]: value } : education,
    )

    setRecruitData((prevData) => ({
      ...prevData,
      educations: updatedEducations,
    }))
  }

  const addEducation = () => {
    const newEducation: EducationDTO = {
      seq: recruitData.seq,
      startPeriod: '',
      endPeriod: '',
      division: '',
      schoolName: '',
      location: '',
      major: '',
      grade: '',
      checked: false,
    }

    setRecruitData((prevData) => ({
      ...prevData,
      educations: [...(prevData.educations || []), newEducation],
    }))
  }

  const toggleCheckbox = (index: number) => {
    const updatedEducations = recruitData.educations?.map((education, idx) =>
      idx === index ? { ...education, checked: !education.checked } : education,
    )

    setRecruitData((prevData) => ({
      ...prevData,
      educations: updatedEducations,
    }))
  }

  const deleteSelectedRows = () => {
    const updatedEducations = recruitData.educations?.filter((educations) => !educations.checked)

    setRecruitData((prevData) => ({
      ...prevData,
      educations: updatedEducations,
    }))
  }

  useEffect(() => {
    if (!recruitData.educations || recruitData.educations.length === 0) {
      setRecruitData((prevData) => ({
        ...prevData,
        educations: [
          {
            seq: recruitData.seq,
            startPeriod: '',
            endPeriod: '',
            division: '',
            schoolName: '',
            location: '',
            major: '',
            grade: '',
            checked: false,
          },
        ],
      }))
    }
  }, [recruitData.certificates, recruitData.seq, setRecruitData])

  return (
    <div className='bg-white shadow-md rounded-lg w-4/5 p-4 mx-auto mt-7'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>학력</h2>
      <div className='flex justify-end mb-4'>
        <button
          type='button'
          onClick={addEducation}
          className='bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md transition-all duration-300 mr-2 px-4 py-2'>
          추가
        </button>
        <button
          type='button'
          onClick={deleteSelectedRows}
          className='bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md shadow-md transition-all duration-300 px-4 py-2'>
          삭제
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table id='educationTable' className='min-w-full bg-white border border-gray-200 rounded-lg shadow-lg'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>재학기간</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>구분</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>학교명(소재지)</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>전공</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>학점</th>
            </tr>
          </thead>
          <tbody>
            {recruitData.educations && recruitData.educations.length > 0 ? (
              recruitData.educations.map((education, index) => (
                <tr key={index} className='even:bg-gray-50'>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='checkbox'
                      checked={education.checked || false}
                      onChange={() => toggleCheckbox(index)}
                      className='form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='선택'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='month'
                      value={education.startPeriod || ''}
                      onChange={(e) => handleChange(index, 'startPeriod', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      min='1960-01'
                      data-th-name='재학기간 시작'
                    />
                    ~
                    <input
                      type='month'
                      value={education.endPeriod || ''}
                      onChange={(e) => handleChange(index, 'endPeriod', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      min='1960-01'
                      data-th-name='재학기간 종료'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <select
                      value={education.division || ''}
                      onChange={(e) => handleChange(index, 'division', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='구분'>
                      <option value=''>선택</option>
                      <option value='졸업'>졸업</option>
                      <option value='중퇴'>중퇴</option>
                      <option value='재학'>재학</option>
                    </select>
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='text'
                      value={education.schoolName || ''}
                      onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='학교명'
                    />
                    <select
                      value={education.location || ''}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='학교 소재지'>
                      <option value=''>선택</option>
                      {cities.map((city) => (
                        <option value={city} key={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='text'
                      value={education.major || ''}
                      onChange={(e) => handleChange(index, 'major', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='전공'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='text'
                      value={education.grade || ''}
                      onChange={(e) => handleChange(index, 'grade', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      placeholder='소숫점을 포함한 숫자를 입력해주세요'
                      data-th-name='학점'
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className='even:bg-gray-50'>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='checkbox'
                    checked={false}
                    onChange={() => {}}
                    className='form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='선택'
                  />
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='month'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    min='1960-01'
                    data-th-name='재학기간 시작'
                  />
                  ~
                  <input
                    type='month'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    min='1960-01'
                    data-th-name='재학기간 종료'
                  />
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <select
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='구분'>
                    <option value=''>선택</option>
                    <option value='졸업'>졸업</option>
                    <option value='중퇴'>중퇴</option>
                    <option value='재학'>재학</option>
                  </select>
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='text'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='학교명'
                  />
                  <select
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='학교 소재지'>
                    <option value=''>선택</option>
                    {cities.map((city) => (
                      <option value={city} key={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='text'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='전공'
                  />
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='text'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    placeholder='소숫점을 포함한 숫자를 입력해주세요'
                    data-th-name='학점'
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Education
