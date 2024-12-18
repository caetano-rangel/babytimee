// app/api/cron/delete-users/route.ts
import { NextResponse } from 'next/server';
import deleteUsersCronJob from '../../lib/cron'; // Importando a função que contém o cron job

export async function GET() {
  try {
    // Chama a função que contém o cron job
    deleteUsersCronJob();

    return NextResponse.json({ message: 'Cron job iniciado com sucesso.' });
  } catch (error) {
    console.error('[API] Erro ao iniciar cron job:', error);
    return NextResponse.json({ message: 'Erro ao iniciar cron job' }, { status: 500 });
  }
}
