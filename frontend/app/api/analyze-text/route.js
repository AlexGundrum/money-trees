import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    // TODO: Replace with actual AI analysis
    // For now, return mock analysis
    const analysis = {
      sentiment: "positive",
      key_points: [
        "Budgeting is important for financial planning",
        "Helps prevent living paycheck to paycheck",
        "Creates financial buffer"
      ],
      recommendations: [
        "Consider creating a detailed monthly budget",
        "Track your expenses regularly",
        "Set specific financial goals"
      ]
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing text:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
} 