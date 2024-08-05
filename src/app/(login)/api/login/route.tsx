import { NextRequest, NextResponse } from 'next/server';

const SPRING_URL: string = process.env.NEXT_PUBLIC_SPRINGBOOT_URL!;

export const POST = async (req: NextRequest) => {
  if (!SPRING_URL) {
    return NextResponse.json({ error: 'SPRINGBOOT_URL is not defined' }, { status: 500 });
  }

  try {
    
    // console.log('Incoming request method:', req.method);
    
    
    const body = await req.json();
    // console.log('Incoming request body:', body); 

    const { name, phone } = body;

    
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // console.log('Sending data to Spring Boot:', { name, phone });

    const response = await fetch(`${SPRING_URL}/next/recruit/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error from Spring Boot:', errorData); 
      return NextResponse.json({ error: 'Failed to fetch data from Spring Boot server', details: errorData }, { status: response.status });
    }

    const data = await response.json();

    // console.log('Response from Spring Boot:', data); 

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during fetch:', error); 
    return NextResponse.json({ error: 'Failed to fetch data from Spring Boot server', details: (error as Error).message }, { status: 500 });
  }
};
