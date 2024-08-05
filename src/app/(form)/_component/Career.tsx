'use client';
import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { RecruitDTO, CareerDTO } from '@/types/SpringBootReponse';
import { toast } from 'react-toastify';

interface CareerProps {
  recruitData: RecruitDTO;
  setRecruitData: React.Dispatch<React.SetStateAction<RecruitDTO>>;
  cities: string[];
}

const Career = forwardRef((props: CareerProps, ref) => {
  const { recruitData, setRecruitData, cities } = props;

  // Function to handle input changes
  const handleChange = (index: number, field: keyof CareerDTO, value: string) => {
    const updatedCareers = recruitData.careers?.map((career, idx) =>
      idx === index ? { ...career, [field]: value } : career
    );

    setRecruitData((prevData) => ({
      ...prevData,
      careers: updatedCareers,
    }));
  };

  // Function to add a new career entry
  const addCareer = () => {
    const newCareer: CareerDTO = {
      seq: recruitData.seq, // Use the foreign key from recruitData
      compName: '',
      location: '',
      startPeriod: '',
      endPeriod: '',
      task: '',
      checked: false, // Initialize with checked as false
    };

    setRecruitData((prevData) => ({
      ...prevData,
      careers: [...(prevData.careers || []), newCareer],
    }));
  };

  // Function to handle checkbox toggle
  const toggleCheckbox = (index: number) => {
    const updatedCareers = recruitData.careers?.map((career, idx) =>
      idx === index ? { ...career, checked: !career.checked } : career
    );

    setRecruitData((prevData) => ({
      ...prevData,
      careers: updatedCareers,
    }));
  };

  // Function to delete selected rows
  const deleteSelectedRows = () => {
    const updatedCareers = recruitData.careers?.filter((career) => !career.checked);

    setRecruitData((prevData) => ({
      ...prevData,
      careers: updatedCareers,
    }));
  };

  // Use useEffect to initialize careers if empty
  useEffect(() => {
    if (!recruitData.careers || recruitData.careers.length === 0) {
      setRecruitData((prevData) => ({
        ...prevData,
        careers: [{
          seq: recruitData.seq,
          compName: '',
          location: '',
          startPeriod: '',
          endPeriod: '',
          task: '',
          checked: false,
        }],
      }));
    }
  }, [recruitData.careers, recruitData.seq, setRecruitData]);

  // useImperativeHandle을 사용하여 부모 컴포넌트에서 사용할 수 있는 메서드 정의
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!recruitData.careers) {
        return true; // Return true if there are no career records to validate
      }

      for (let index = 0; index < recruitData.careers.length; index++) {
        const career = recruitData.careers[index];
        const fields: (keyof CareerDTO)[] = [
          'startPeriod',
          'endPeriod',
          'compName',
          'task',
          'location',
        ];

        for (const field of fields) {
          const fieldValue = career[field];

          // Ensure the field is not undefined and is a string
          if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
            // 필드 요소 선택
            const fieldElement = document.getElementById(`career-${index}-${field}`) as HTMLInputElement | HTMLSelectElement | null;

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

        // Additional validation: date comparison
        const startPeriod = career.startPeriod || ''; // Use empty string as default
        const endPeriod = career.endPeriod || ''; // Use empty string as default

        const startDate = new Date(startPeriod);
        const endDate = new Date(endPeriod);

        if (startDate > endDate) {
          const startFieldElement = document.getElementById(`career-${index}-startPeriod`) as HTMLInputElement | HTMLSelectElement | null;
          if (startFieldElement) {
            startFieldElement.focus();
            startFieldElement.classList.add('outline-red-500', 'outline-2');
            toast.error('근무기간 시작일은 종료일보다 이전이어야 합니다.', {
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">경력</h2>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={addCareer}
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
        <table id="careerTable" className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">선택</th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">근무기간</th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">회사명</th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">부서/직급/직책</th>
              <th className="border-b border-gray-200 py-3 text-center text-gray-700">지역</th>
            </tr>
          </thead>
          <tbody>
            {recruitData.careers && recruitData.careers.length > 0 ? (
              recruitData.careers.map((career, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={career.checked || false}
                      onChange={() => toggleCheckbox(index)}
                      className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="선택"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="month"
                      id={`career-${index}-startPeriod`}
                      value={career.startPeriod || ''}
                      onChange={(e) => handleChange(index, 'startPeriod', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      min="1960-01"
                      data-th-name="근무기간 시작"
                    />
                    ~
                    <input
                      type="month"
                      id={`career-${index}-endPeriod`}
                      value={career.endPeriod || ''}
                      onChange={(e) => handleChange(index, 'endPeriod', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      min="1960-01"
                      data-th-name="근무기간 종료"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="text"
                      id={`career-${index}-compName`}
                      value={career.compName || ''}
                      onChange={(e) => handleChange(index, 'compName', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="회사명"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <input
                      type="text"
                      id={`career-${index}-task`}
                      value={career.task || ''}
                      onChange={(e) => handleChange(index, 'task', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="부서/직급/직책"
                    />
                  </td>
                  <td className="border-b border-gray-200 py-3 text-center">
                    <select
                      id={`career-${index}-location`}
                      value={career.location || ''}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      data-th-name="지역"
                    >
                      <option value="">선택</option>
                      {cities.map((city) => (
                        <option value={city} key={city}>
                          {city}
                        </option>
                      ))}
                    </select>
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
                    data-th-name="근무기간 시작"
                  />
                  ~
                  <input
                    type="month"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    min="1960-01"
                    data-th-name="근무기간 종료"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="text"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="회사명"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <input
                    type="text"
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="부서/직급/직책"
                  />
                </td>
                <td className="border-b border-gray-200 py-3 text-center">
                  <select
                    value=""
                    onChange={() => {}}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                    data-th-name="지역"
                  >
                    <option value="">선택</option>
                    {cities.map((city) => (
                      <option value={city} key={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default Career;
