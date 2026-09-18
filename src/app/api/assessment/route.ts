import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Analyze role and return appropriate mock data
    if (data.role === 'sma') {
      return NextResponse.json({
        success: true,
        message: 'Assessment completed by AI.',
        houseAssigned: 'House of Technology',
        recommendedPath: 'Web Development',
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'CV analyzed by AI.',
        careerPath: 'Full-Stack Web3 Developer',
        matchScore: 85,
      });
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process assessment' },
      { status: 500 }
    );
  }
}
