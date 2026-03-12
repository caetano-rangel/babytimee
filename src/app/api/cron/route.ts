export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import deleteUsersCronJob from '../../lib/cron';

export async function GET() {
  try {
    const result = await deleteUsersCronJob();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro no cron:', error);
    return NextResponse.json({ message: 'Erro ao iniciar cron job' }, { status: 500 });
  }
}