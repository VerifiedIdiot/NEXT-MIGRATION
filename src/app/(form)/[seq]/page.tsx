import type { Metadata } from 'next';
import { RecruitDTO } from '@/types/SpringBootReponse';
import { fetchUserInfo } from '@/api/login/login';
import Tables from '../_component/Tables';


export const metadata: Metadata = {
  title: '입사지원서',
  description: '지원자님의 인적정보를 채워주세요',
};

const FormPage = async ({ searchParams }: { searchParams: { seq: string } }) => {
  const seq = searchParams.seq;
  const data: RecruitDTO = await fetchUserInfo(seq);
  console.log(data);

  
  const recruitVo: RecruitDTO = {
    seq: data.seq,
    name: data.name,
    birth: data.birth || null,
    phone: data.phone,
    email: data.email || null,
    addr: data.addr || null,
    location: data.location || null,
    workType: data.workType || null,
    submitFlag: data.submitFlag || false,
    gender: data.gender || null,
    educations: data.educations || [],
    careers: data.careers || [],
    certificates: data.certificates || [],
  };

  // 도시 리스트
  const cities = [
    '서울', '부산', '대구', '인천', '광주', 
    '대전', '울산', '세종', '경기', '강원', 
    '충북', '충남', '전북', '전남', '경북', 
    '경남', '제주'
  ];

  // 렌더링 부분
  return (
    <div className="h-screen flex flex-col items-center w-full bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-4 mt-8">입사지원서</h1>
      <Tables recruitVo={recruitVo} cities={cities}/>
    </div>
  );
}

export default FormPage;
