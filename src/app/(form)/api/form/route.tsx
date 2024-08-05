import { NextRequest, NextResponse } from 'next/server';

const SPRING_URL: string = process.env.NEXT_PUBLIC_SPRINGBOOT_URL!;

export const GET = async (req: NextRequest) => {
    if (!SPRING_URL) {
      return NextResponse.json({ error: 'SPRINGBOOT_URL is not defined' }, { status: 500 });
    }
  
    try {
      const { searchParams } = req.nextUrl;
      const seq = searchParams.get('seq');
  
      console.log('Received seq:', seq);
  
      if (!seq) {
        return NextResponse.json({ error: 'Seq is required' }, { status: 400 });
      }
      const response = await fetch(`${SPRING_URL}/next/recruit/form?seq=${seq}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error from Spring Boot:', errorData); 
        return NextResponse.json({ error: 'Failed to fetch data from Spring Boot server', details: errorData }, { status: response.status });
      }
  
      const data = await response.json();
  
      console.log('Response from Spring Boot:', data); 
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error during fetch:', error); 
      return NextResponse.json({ error: 'Failed to fetch data from Spring Boot server', details: (error as Error).message }, { status: 500 });
    }
  };
  
