'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import QRCode from 'qrcode';
import useEmblaCarousel from 'embla-carousel-react';

interface UserData {
  nomeBebe: string;
  nomePais: string;
  dataNascimento: string;
  horaNascimento: string;
  mensagem: string;
  plano: string;
  fotos: string[];
}

async function fetchUserData(slug: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
  return data as UserData;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const UserPage: React.FC<PageProps> = ({ params }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<any>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);

      const data = await fetchUserData(resolvedParams.slug);
      if (data) {
        setUserData(data);
        const qrCodeData = `${process.env.NEXT_PUBLIC_BASE_URL}/${resolvedParams.slug}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);
        setQrCodeUrl(qrCode);

        const birthDate = new Date(`${data.dataNascimento}T${data.horaNascimento}`);
        calculateTimeElapsed(birthDate);
      }
    };

    fetchData();
  }, [params]);

  const calculateTimeElapsed = (birthDate: Date) => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();

      let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
      let months = now.getUTCMonth() - birthDate.getUTCMonth();
      let days = now.getUTCDate() - birthDate.getUTCDate();

      const hours = Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 3600));
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (months < 0) {
        months += 12;
        years--;
      }

      if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        days = lastMonth.getDate() + days;
        months--;
        if (months < 0) {
          months = 11;
          years--;
        }
      }

      setTimeElapsed({
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!emblaApi) return;

    const autoPlay = () => {
      const intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 5000);

      return () => clearInterval(intervalId);
    };

    const cleanup = autoPlay();

    return () => cleanup();
  }, [emblaApi]);

  if (!userData) return <p className="text-center text-lg text-gray-600">Carregando...</p>;

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `QRCode-${slug}.png`;
      link.click();
    }
  };

  const startAudio = () => {
    // Verifica se o usuário tem o plano premium
    if (userData && userData.plano === 'sempre') {
      const audio = document.getElementById('background-audio') as HTMLAudioElement;
      if (audio) {
        audio.volume = 0.2;
        audio
          .play()
          .then(() => {
            console.log('Áudio tocando');
          })
          .catch((err) => {
            console.error('Erro ao tentar tocar o áudio:', err);
          });
      } else {
        console.error('Elemento de áudio não encontrado');
      }

      document.removeEventListener('click', startAudio); // Remove o evento após tocar o áudio
    } else {
      console.log('O usuário não tem plano premium, áudio não tocado');
    }
  };

  // Aguarda o clique para iniciar o áudio
  document.addEventListener('click', startAudio);


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#295566] bg-cover bg-center"
      style={{
        backgroundImage: `
          url('/nuvem.png'), 
          url('/nuvem.png'), 
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '5% 20%, 75% 65%, 75% 32%, 10% 80%, 85% 5%, 90% 90%',
        backgroundSize: '150px, 200px, 180px, 160px, 190px, 180px, 130px',
        opacity: 0.8,
      }}
    >

      {/* Player de música de fundo */}
      <audio id="background-audio" loop>
        <source src="/rugrats.mp3" type="audio/mp3" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {userData && (
        <div className="text-center text-white p-8 max-w-3xl w-full rounded-xl">
          <h1
            className="text-6xl font-semibold mb-6 uppercase tracking-wide bg-gradient-to-r from-amber-950 via-amber-600 to-amber-300 text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {userData.nomeBebe}
          </h1>

          {/* Carrossel de fotos do bebê */}
          <div className="mt-8">
            <div className="embla overflow-hidden max-w-lg mx-auto" ref={emblaRef}>
              <div className="embla__container flex">
                {userData.fotos.length > 0 ? (
                  userData.fotos.map((fotoUrl, index) => (
                    <div
                      key={index}
                      className="embla__slide flex-[0_0_100%] px-4"
                    >
                      <img
                        src={fotoUrl}
                        alt={`Foto ${index + 1}`}
                        className="rounded-lg  object-contain w-full h-auto"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-lg text-gray-300">Nenhuma foto disponível.</p>
                )}
              </div>
            </div>
          </div>

          {timeElapsed && (
            <div className="mt-16">
              <h2
                className="text-xl font-semibold text-center uppercase bg-gradient-to-r from-amber-800 via-amber-500 to-amber-300 text-transparent mb-4"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tempo desde o nascimento
              </h2>
              {/* Primeiro quadrado */}
              <div className="flex flex-col items-center bg-gradient-to-r from-purple-900 to-black text-white p-6 rounded-lg border-4 border-amber-600 mb-4">
                <div className="grid grid-cols-3 gap-11">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.years}</span>
                    <span className="text-gray-400">Anos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.months}</span>
                    <span className="text-gray-400">Meses</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.days}</span>
                    <span className="text-gray-400">Dias</span>
                  </div>
                </div>
              </div>

              {/* Segundo quadrado */}
              <div className="flex flex-col items-center bg-gradient-to-r from-purple-900 to-black text-white p-6 rounded-lg border-4 border-amber-600">
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.hours}</span>
                    <span className="text-gray-400">Horas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.minutes}</span>
                    <span className="text-gray-400">Minutos</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-3xl">{timeElapsed.seconds}</span>
                    <span className="text-gray-400">Segundos</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p
            className="text-xl bg-gradient-to-r from-amber-600 via-amber-400 to-amber-100 text-transparent mb-4 font-semibold mt-16 capitalize"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Mensagem de: {userData.nomePais}
          </p>

          <div className="mt-4 text-lg border-2 g-white bg-white bg-opacity-40 rounded-lg border-white p-4 text-black italic max-w-md mx-auto">
            {userData.mensagem}
          </div>

          {qrCodeUrl && (
            <div className="mt-16">
              <div className="flex justify-center mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 rounded-lg shadow-md" />
              </div>
              <button
                onClick={downloadQRCode}
                className="w-1/2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 text-black p-3 rounded-lg shadow-lg shadow-amber-600/60 hover:shadow-xl hover:shadow-amber-700/70 transition duration-300"
              >
                Baixar Seu QR Code
              </button>
            </div>
          )}
        </div>
      )}
      {/* Footer */}
      <footer className="pb-6 pt-3 text-gray-400 text-center">
        {/* Logo e descrição */}
        <div className="mb-3">
          <img src="/chupeta.png" width={80} height={100} alt="Logo" className="mx-auto mb-2 h-18" />
        </div>
        {/* Direitos autorais */}
        <p className="mb-4 text-xs">Copyright © 2024 BabyTimee - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default UserPage;
