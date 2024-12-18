'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const ConfirmPage = () => {
  const [status, setStatus] = useState('pendente');
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');

  useEffect(() => {
    if (!slug) {
      console.error("Slug não definido!");
      return;
    }

    const checkStatus = async () => {
      console.log("Verificando status no Supabase...");
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return;
      }

      if (data) {
        setStatus(data.status);

        if (data.status === 'aprovado') {
          console.log(`Status aprovado. Redirecionando para /${slug}`);
          router.push(`/${slug}`);
        }
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [slug, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 bg-cover bg-center relative">
      <div className="relative z-10 max-w-2xl w-full mx-4 sm:mx-8 p-8 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Aguardando Confirmação de Pagamento</h1>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">Status atual: <span className={`font-semibold ${status === 'aprovado' ? 'text-green-600' : 'text-yellow-600'}`}>{status}</span></p>
          <p className="text-md text-gray-600">Por favor, aguarde enquanto construimos seu site...</p>
        </div>
        <div className="flex justify-center mt-6">
          <div className="animate-pulse text-xl text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 3.5a7.5 7.5 0 1115 0A7.5 7.5 0 015 3.5zm0 1a6.5 6.5 0 106.5 6.5A6.5 6.5 0 005 4.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ConfirmPageWithSuspense() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}
