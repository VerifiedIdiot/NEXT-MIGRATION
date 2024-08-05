// Tables.tsx

'use client';
import React, { useState, useRef } from 'react';
import { RecruitDTO } from '@/types/SpringBootReponse';
import Recruit from './Recruit';
import Education from './Education';
import Career from './Career';
import Certificate from './Certificate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RecruitProps {
  recruitVo: RecruitDTO;
  cities: string[];
}

const Tables: React.FC<RecruitProps> = ({ recruitVo, cities }) => {
  const [recruitData, setRecruitData] = useState<RecruitDTO>(recruitVo);

  const recruitRef = useRef<any>(null);
  const educationRef = useRef<any>(null);
  const careerRef = useRef<any>(null);
  const certificateRef = useRef<any>(null);

  const handleSave = async () => {
    
    const isRecruitValid = recruitRef.current?.validate();
    const isEducationValid = educationRef.current?.validate();

    if (isRecruitValid && isEducationValid) {
      console.log(recruitData);
    }
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <ToastContainer position='top-center' autoClose={3000} />
      <Recruit
        recruitData={recruitData}
        setRecruitData={setRecruitData}
        cities={cities}
        ref={recruitRef}
      />
      <Education
        recruitData={recruitData}
        setRecruitData={setRecruitData}
        cities={cities}
        ref={educationRef}
      />
      <Career recruitData={recruitData} setRecruitData={setRecruitData} cities={cities}
      ref={careerRef}
      /> 
      <Certificate recruitData={recruitData} setRecruitData={setRecruitData} 
      ref={certificateRef}
      />
      <div className='flex justify-end mt-4 space-x-4'>
        <button
          type='button'
          onClick={handleSave}
          className='bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-md shadow-md transition-all duration-300 px-4 py-2'>
          저장
        </button>
      </div>
    </div>
  );
};

export default Tables;
