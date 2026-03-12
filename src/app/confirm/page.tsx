'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const themes = {
  menino: {
    pageBg: 'linear-gradient(155deg,#f0f7ff 0%,#e0eeff 50%,#f0eeff 100%)',
    blobColor1: 'rgba(147,197,253,0.25)', blobColor2: 'rgba(196,181,253,0.18)',
    spinnerBg: 'linear-gradient(135deg,#dbeafe,#ede9fe)',
    spinnerStroke: '#3b82f6', light: '#dbeafe', primary: '#3b82f6',
    badgeColor: '#3b82f6', dotActive: '#3b82f6', nameColor: '#3b82f6',
    gradient: 'linear-gradient(135deg,#93c5fd,#3b82f6)',
    emoji: '💙',
  },
  menina: {
    pageBg: 'linear-gradient(155deg,#fff5f8 0%,#fef0f7 50%,#f5f0ff 100%)',
    blobColor1: 'rgba(249,168,201,0.25)', blobColor2: 'rgba(196,181,253,0.18)',
    spinnerBg: 'linear-gradient(135deg,#fce4ef,#ede9fe)',
    spinnerStroke: '#e879a0', light: '#fce4ef', primary: '#e879a0',
    badgeColor: '#c0507a', dotActive: '#e879a0', nameColor: '#c0507a',
    gradient: 'linear-gradient(135deg,#f9a8c9,#e879a0)',
    emoji: '💗',
  },
};

const ConfirmPage = () => {
  const [status, setStatus] = useState('pendente');
  const [sexo, setSexo] = useState<'menino'|'menina'>('menina');
  const [dots, setDots] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');

  const t = themes[sexo];

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const checkStatus = async () => {
      const { data, error } = await supabase.from('users').select('status, sexo').eq('slug', slug).single();
      if (error) { console.error('Erro:', error); return; }
      if (data) {
        setStatus(data.status);
        if (data.sexo) setSexo(data.sexo);
        if (data.status === 'aprovado') router.push(`/${slug}`);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [slug, router]);

  return (
    <div style={{
      fontFamily:"'Nunito',sans-serif", minHeight:'100vh',
      background: t.pageBg,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'24px', position:'relative', overflow:'hidden', transition:'background 0.5s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes pulse-ring  { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }
        @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>

      <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, background:`radial-gradient(circle,${t.blobColor1},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, background:`radial-gradient(circle,${t.blobColor2},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />

      <div style={{ background:'white', borderRadius:28, padding:'52px 40px', border:`1.5px solid ${t.light}`, boxShadow:`0 8px 48px ${t.primary}20`, maxWidth:460, width:'100%', textAlign:'center' }}>

        {/* spinner */}
        <div style={{ position:'relative', width:80, height:80, margin:'0 auto 32px' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:`linear-gradient(135deg,${t.light}60,#ede9fe60)`, animation:'pulse-ring 1.5s ease-out infinite' }} />
          <div style={{ position:'relative', width:80, height:80, borderRadius:'50%', background: t.spinnerBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg style={{ width:36, height:36, animation:'spin 1.5s linear infinite' }} viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" stroke={t.light} />
              <path d="M12 2a10 10 0 0 1 10 10" stroke={t.spinnerStroke} strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div style={{ fontSize:48, marginBottom:16, animation:'float 2.5s ease-in-out infinite' }}>
          {sexo === 'menino' ? '👦' : '👧'}
        </div>

        <h1 className="pf" style={{ fontSize:'1.8rem', fontWeight:700, color:'#2d1b2e', marginBottom:12 }}>
          Confirmando pagamento
        </h1>

        <p style={{ color:'#6b5c6e', fontSize:'0.97rem', lineHeight:1.6, marginBottom:28 }}>
          Estamos construindo a página do seu bebê com muito carinho{dots}
        </p>

        {/* status badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'8px 20px', borderRadius:50, marginBottom:28,
          background: status === 'aprovado' ? 'linear-gradient(135deg,#d1fae5,#a7f3d0)' : `linear-gradient(135deg,${t.light},#ede9fe)`,
          border: `1px solid ${status === 'aprovado' ? '#6ee7b7' : t.light}`,
        }}>
          <div style={{
            width:8, height:8, borderRadius:'50%',
            background: status === 'aprovado' ? '#10b981' : t.dotActive,
            boxShadow:`0 0 6px ${status === 'aprovado' ? '#10b981' : t.dotActive}`,
          }} />
          <span style={{ fontSize:'0.82rem', fontWeight:700, color: status === 'aprovado' ? '#065f46' : t.badgeColor }}>
            {status === 'aprovado' ? 'Aprovado! Redirecionando...' : 'Aguardando confirmação'}
          </span>
        </div>

        <p style={{ color:'#a08898', fontSize:'0.78rem' }}>
          Você receberá um e-mail com o link da sua página {t.emoji}
        </p>
      </div>

      <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:8, opacity:0.6 }}>
        <img src="/chupeta.png" alt="BabyTimee" style={{ width:22, height:22, objectFit:'contain' }} />
        <span className="pf" style={{ fontSize:'1rem', color: t.nameColor, fontWeight:700 }}>BabyTimee</span>
      </div>
    </div>
  );
};

export default function ConfirmPageWithSuspense() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f7ff' }}>
        <p style={{ color:'#3b82f6', fontFamily:'Nunito,sans-serif' }}>Carregando...</p>
      </div>
    }>
      <ConfirmPage />
    </Suspense>
  );
}