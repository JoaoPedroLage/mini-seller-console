import { NextResponse } from 'next/server';
import leadsData from '@/data/leads.json';

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(leadsData);
}