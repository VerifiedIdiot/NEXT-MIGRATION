// Education.tsx

'use client';
import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { RecruitDTO, EducationDTO } from '@/types/SpringBootReponse';
import { toast } from 'react-toastify';

interface EducationProps {
  recruitData: RecruitDTO;
  setRecruitData: React.Dispatch<React.SetStateAction<RecruitDTO>>;
  cities: string[];
}

const Education = forwardRef((props: EducationProps, ref) => {
    const { recruitData, setRecruitData, cities } = props;
  
    const handleChange = (index: number, field: keyof EducationDTO, value: string) => {
      const updatedEducations = recruitData.educations?.map((education, idx) =>
        idx === index ? { ...education, [field]: value } : education
      );
  
      setRecruitData((prevData) => ({
        ...prevData,
        educations: updatedEducations,
      }));
    };
  
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
      };
  
      setRecruitData((prevData) => ({
        ...prevData,
        educations: [...(prevData.educations || []), newEducation],
      }));
    };
  
    const toggleCheckbox = (index: number) => {
      const updatedEducations = recruitData.educations?.map((education, idx) =>
        idx === index ? { ...education, checked: !education.checked } : education
      );
  
      setRecruitData((prevData) => ({
        ...prevData,
        educations: updatedEducations,
      }));
    };
  
    const deleteSelectedRows = () => {
      const updatedEducations = recruitData.educations?.filter((education) => !education.checked);
  
      setRecruitData((prevData) => ({
        ...prevData,
        educations: updatedEducations,
      }));
    };
  
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
        }));
      }
    }, [recruitData.certificates, recruitData.seq, setRecruitData]);
  
    // useImperativeHandle을 사용하여 부모 컴포넌트에서 사용할 수 있는 메서드 정의
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!recruitData.educations) {
          return true; // Return true if there are no education records to validate
        }
  
        for (let index = 0; index < recruitData.educations.length; index++) {
          const education = recruitData.educations[index];
          const fields: (keyof EducationDTO)[] = [
            'startPeriod',
            'endPeriod',
            'division',
            'schoolName',
            'location',
            'major',
            'grade',
          ];
  
          for (const field of fields) {
            const fieldValue = education[field];
  
            // Ensure the field is not undefined and is a string
            if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
              // 필드 요소 선택
              const fieldElement = document.getElementById(`education-${index}-${field}`) as HTMLInputElement | HTMLSelectElement | null;
  
              // 필드에 포커스 및 강조
              if (fieldElement) {
                fieldElement.focus();
                fieldElement.classList.add('outline-red-500', 'outline-2');
  
                const message = fieldElement.getAttribute('data-th-name');
                if (message) {
                  toast.error(`${message}을(를) 입력해 주세요.`, {
                    toastId: 'validationError',
                  });
                }
              }
  
              return false;
            }
          }
  
          const startDate = new Date(education.startPeriod || '');
          const endDate = new Date(education.endPeriod || '');
  
          if (startDate > endDate) {
            const startFieldElement = document.getElementById(`education-${index}-startPeriod`) as HTMLInputElement | HTMLSelectElement | null;
            if (startFieldElement) {
              startFieldElement.focus();
              startFieldElement.classList.add('outline-red-500', 'outline-2');
              toast.error('재학기간 시작일은 종료일보다 이전이어야 합니다.', {
                toastId: 'validationError',
              });
            }
            return false;
          }
        }
        return true;
      },
    }));

  return (
    <div className="bg-white shadow-md rounded-lg w-4/5 p-4 mx-auto mt-7">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">학력</h2>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md transition-all duration-300 mr-2 px-4 py-2"
        >
          추가
        </button>
        <button
          type="button"
          onClick={deleteSelectedRows}
          className="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md shadow-md transition-all duration-300 px-4 py-2"
        >
          삭제
        </button>
      </div>
      <div className="overflow-x-auto">
        <table
          id="educationTable"
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <thead className="bg-gray-100">
            <tr>
            <th className='border-b border-gray-200 py-3 text-center text-gray-700'>선택</th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">
                재학기간
              </th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">
                구분
              </th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">
                학교명(소재지)
              </th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">
                전공
              </th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">
                학점
              </th>
            </tr>
          </thead>
          <tbody>
            {recruitData.educations && recruitData.educations.length > 0 ? (
              recruitData.educations.map((education, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={education.checked || false}
                      onChange={() => toggleCheckbox(index)}
                      className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="선택"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="month"
                      id={`education-${index}-startPeriod`}
                    defaultValue={education.startPeriod || ''}
                      onChange={(e) =>
                        handleChange(index, 'startPeriod', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      min="1960-01"
                      data-th-name="재학기간 시작"
                    />
                    ~
                    <input
                      type="month"
                      id={`education-${index}-endPeriod`}
                      defaultValue={education.endPeriod || ''}
                      onChange={(e) =>
                        handleChange(index, 'endPeriod', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      min="1960-01"
                      data-th-name="재학기간 종료"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <select
                      id={`education-${index}-division`}
                      value={education.division || ''}
                      onChange={(e) =>
                        handleChange(index, 'division', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="구분"
                    >
                      <option value="">선택</option>
                      <option value="졸업">졸업</option>
                      <option value="중퇴">중퇴</option>
                      <option value="재학">재학</option>
                    </select>
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="text"
                      id={`education-${index}-schoolName`}
                      value={education.schoolName || ''}
                      onChange={(e) =>
                        handleChange(index, 'schoolName', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="학교명"
                    />
                    <select
                      id={`education-${index}-location`}
                      value={education.location || ''}
                      onChange={(e) =>
                        handleChange(index, 'location', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="학교 소재지"
                    >
                      <option value="">선택</option>
                      {cities.map((city) => (
                        <option value={city} key={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="text"
                      id={`education-${index}-major`}
                      value={education.major || ''}
                      onChange={(e) =>
                        handleChange(index, 'major', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="전공"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="text"
                      id={`education-${index}-grade`}
                      value={education.grade || ''}
                      onChange={(e) =>
                        handleChange(index, 'grade', e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      placeholder="소숫점을 포함한 숫자를 입력해주세요"
                      data-th-name="학점"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="even:bg-gray-50">
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => {}}
                    className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="선택"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="month"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    min="1960-01"
                    data-th-name="재학기간 시작"
                  />
                  ~
                  <input
                    type="month"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    min="1960-01"
                    data-th-name="재학기간 종료"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <select
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="구분"
                  >
                    <option value="">선택</option>
                    <option value="졸업">졸업</option>
                    <option value="중퇴">중퇴</option>
                    <option value="재학">재학</option>
                  </select>
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="text"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="학교명"
                  />
                  <select
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="학교 소재지"
                  >
                    <option value="">선택</option>
                    {cities.map((city) => (
                      <option value={city} key={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="text"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="전공"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="text"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    placeholder="소숫점을 포함한 숫자를 입력해주세요"
                    data-th-name="학점"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Education;
