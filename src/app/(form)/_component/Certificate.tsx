'use client';
import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { RecruitDTO, CertificateDTO } from '@/types/SpringBootReponse';
import { toast } from 'react-toastify';

interface CertificateProps {
  recruitData: RecruitDTO;
  setRecruitData: React.Dispatch<React.SetStateAction<RecruitDTO>>;
}

const Certificate = forwardRef((props: CertificateProps, ref) => {
  const { recruitData, setRecruitData } = props;

  // Function to handle input changes
  const handleChange = (index: number, field: keyof CertificateDTO, value: string) => {
    const updatedCertificates = recruitData.certificates?.map((certificate, idx) =>
      idx === index ? { ...certificate, [field]: value } : certificate
    );

    setRecruitData((prevData) => ({
      ...prevData,
      certificates: updatedCertificates,
    }));
  };

  const addCertificate = () => {
    const newCertificate: CertificateDTO = {
      seq: recruitData.seq,
      qualifiName: '',
      acquDate: '',
      organizeName: '',
      checked: false,
    };

    setRecruitData((prevData) => ({
      ...prevData,
      certificates: [...(prevData.certificates || []), newCertificate],
    }));
  };

  const toggleCheckbox = (index: number) => {
    const updatedCertificates = recruitData.certificates?.map((certificate, idx) =>
      idx === index ? { ...certificate, checked: !certificate.checked } : certificate
    );

    setRecruitData((prevData) => ({
      ...prevData,
      certificates: updatedCertificates,
    }));
  };

  const deleteSelectedRows = () => {
    const updatedCertificates = recruitData.certificates?.filter((certificate) => !certificate.checked);

    setRecruitData((prevData) => ({
      ...prevData,
      certificates: updatedCertificates,
    }));
  };

  useEffect(() => {
    if (!recruitData.certificates || recruitData.certificates.length === 0) {
      setRecruitData((prevData) => ({
        ...prevData,
        certificates: [
          {
            seq: recruitData.seq,
            qualifiName: '',
            acquDate: '',
            organizeName: '',
            checked: false,
          },
        ],
      }));
    }
  }, [recruitData.certificates, recruitData.seq, setRecruitData]);

  // useImperativeHandle을 사용하여 부모 컴포넌트에서 사용할 수 있는 메서드 정의
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!recruitData.certificates) {
        return true; // Return true if there are no certificate records to validate
      }

      for (let index = 0; index < recruitData.certificates.length; index++) {
        const certificate = recruitData.certificates[index];
        const fields: (keyof CertificateDTO)[] = [
          'qualifiName',
          'acquDate',
          'organizeName',
        ];

        for (const field of fields) {
          const fieldValue = certificate[field];

          // Ensure the field is not undefined and is a string
          if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
            // 필드 요소 선택
            const fieldElement = document.getElementById(`certificate-${index}-${field}`) as HTMLInputElement | HTMLSelectElement | null;

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

        // Additional validation: acquisition date comparison
        const acquDate = certificate.acquDate || ''; // Use empty string as default
        const acquisitionDate = new Date(acquDate);

        if (acquisitionDate > new Date()) {
          const acquDateFieldElement = document.getElementById(`certificate-${index}-acquDate`) as HTMLInputElement | HTMLSelectElement | null;
          if (acquDateFieldElement) {
            acquDateFieldElement.focus();
            acquDateFieldElement.classList.add('outline-red-500', 'outline-2');
            toast.error('취득일은 현재 날짜보다 이전이어야 합니다.', {
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
    <div className='bg-white shadow-md rounded-lg w-4/5 p-4 mx-auto mt-7'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4'>자격증</h2>
      <div className='flex justify-end mb-4'>
        <button
          type='button'
          onClick={addCertificate}
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
        <table id='certificateTable' className='min-w-full bg-white border border-gray-200 rounded-lg shadow-lg'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>선택</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>자격증명</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>취득일</th>
              <th className='border-b border-gray-200 py-3 text-center text-gray-700'>발행처</th>
            </tr>
          </thead>
          <tbody>
            {recruitData.certificates && recruitData.certificates.length > 0 ? (
              recruitData.certificates.map((certificate, index) => (
                <tr key={index} className='even:bg-gray-50'>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='checkbox'
                      checked={certificate.checked || false}
                      onChange={() => toggleCheckbox(index)}
                      className='form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='선택'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='text'
                      id={`certificate-${index}-qualifiName`}
                      value={certificate.qualifiName || ''}
                      onChange={(e) => handleChange(index, 'qualifiName', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='자격증명'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='date'
                      id={`certificate-${index}-acquDate`}
                      value={certificate.acquDate || ''}
                      onChange={(e) => handleChange(index, 'acquDate', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='취득일'
                    />
                  </td>
                  <td className='border-b border-gray-200 py-3 text-center'>
                    <input
                      type='text'
                      id={`certificate-${index}-organizeName`}
                      value={certificate.organizeName || ''}
                      onChange={(e) => handleChange(index, 'organizeName', e.target.value)}
                      className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                      data-th-name='발행처'
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
                    type='text'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='자격증명'
                  />
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='date'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='취득일'
                  />
                </td>
                <td className='border-b border-gray-200 py-3 text-center'>
                  <input
                    type='text'
                    value=''
                    onChange={() => {}}
                    className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300'
                    data-th-name='발행처'
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

export default Certificate;
