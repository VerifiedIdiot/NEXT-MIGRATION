import apiClient from '@/api/AxiosConfig';
import { RecruitDTO} from "@/types/SpringBootReponse";

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL!;

interface LoginInput {
  name?: string;
  phone?: string;
}


interface LoginResponse {
  seq? : string;
  success?: boolean;
  message?: string;
}


interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// submitLogin 함수
export const submitLogin = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(`${BASE_URL}/api/login`, {
      name : input.name,
      phone : input.phone
    });
    
    return response.data;
  } catch (error) {
    console.error('Error trying to submit login', error);

    
    const errorMessage = (error as ErrorResponse)?.response?.data?.message ?? '로그인 요청 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const fetchUserInfo = async (seq: string) => {
    try {
      console.log(`${seq} 호출됨`)
      const response = await apiClient.get<RecruitDTO>(`${BASE_URL}/api/form`, {
        params: { seq }
      });
      return response.data;
    } catch (error) {
      console.error('Error trying to fetch user info', error);
      throw error;
    }
  };
