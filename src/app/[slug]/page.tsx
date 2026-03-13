'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import QRCode from 'qrcode';
import useEmblaCarousel from 'embla-carousel-react';

interface UserData {
  nomeBebe: string; nomePais: string; dataNascimento: string;
  horaNascimento: string; mensagem: string; plano: string;
  fotos: string[]; sexo: 'menino' | 'menina';
}
interface TimeElapsed {
  years: number; months: number; days: number;
  hours: number; minutes: number; seconds: number;
}
interface PageProps { params: Promise<{ slug: string }>; }

/* ── Temas ── */
const themes = {
  menino: {
    emoji:'💙', heroBg:'linear-gradient(155deg,#e0f0ff 0%,#dbeafe 40%,#ede9fe 100%)',
    blobColor1:'rgba(147,197,253,0.3)', blobColor2:'rgba(196,181,253,0.2)',
    primary:'#3b82f6', light:'#dbeafe', medium:'#93c5fd',
    gradient:'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)',
    shadow:'rgba(96,165,250,0.3)', badgeColor:'#3b82f6',
    countColor1:'#3b82f6', countColor2:'#6366f1',
    cardBg2:'linear-gradient(135deg,#f0eeff,#ede9fe)',
    border1:'#dbeafe', border2:'#e0e7ff',
    quoteColor:'#dbeafe', footerName:'#93c5fd',
    pageBg:'linear-gradient(180deg,#f0f7ff 0%,#e8f0fe 30%,#f0eeff 100%)',
  },
  menina: {
    emoji:'💗', heroBg:'linear-gradient(155deg,#fff5f8 0%,#fce4ef 40%,#ede9fe 100%)',
    blobColor1:'rgba(249,168,201,0.3)', blobColor2:'rgba(196,181,253,0.2)',
    primary:'#e879a0', light:'#fce4ef', medium:'#f9a8c9',
    gradient:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
    shadow:'rgba(232,121,160,0.3)', badgeColor:'#c0507a',
    countColor1:'#e879a0', countColor2:'#a78bfa',
    cardBg2:'linear-gradient(135deg,#fdf4ff,#f5f0ff)',
    border1:'#fce4ef', border2:'#ede9fe',
    quoteColor:'#fce4ef', footerName:'#f9a8c9',
    pageBg:'linear-gradient(180deg,#fff5f8 0%,#fef0f7 30%,#f5f0ff 100%)',
  },
};

/* ── Signos ── */
interface ZodiacSign {
  nome: string;
  simbolo: string;
  elemento: string;
  pedra: string;
  descricao: string;
  emoji: string;
  datas: string;
}

const SIGNOS: ZodiacSign[] = [
  {
    nome: 'Áries', simbolo: '♈', elemento: 'Fogo 🔥', pedra: 'Diamante 💎', emoji: '🐏',
    datas: '21/03 – 19/04',
    descricao: 'Corajoso, pioneiro e cheio de energia. Arianos são líderes natos, movidos pela paixão e pela vontade de conquistar o mundo com entusiasmo.',
  },
  {
    nome: 'Touro', simbolo: '♉', elemento: 'Terra 🌍', pedra: 'Esmeralda 💚', emoji: '🐂',
    datas: '20/04 – 20/05',
    descricao: 'Determinado, leal e amante da beleza. Taurinos são estáveis e persistentes, encontrando alegria nas pequenas delícias da vida.',
  },
  {
    nome: 'Gêmeos', simbolo: '♊', elemento: 'Ar 💨', pedra: 'Ágata 🔵', emoji: '👯',
    datas: '21/05 – 20/06',
    descricao: 'Curioso, comunicativo e versátil. Geminianos adoram aprender e compartilhar, adaptando-se com facilidade a qualquer situação.',
  },
  {
    nome: 'Câncer', simbolo: '♋', elemento: 'Água 💧', pedra: 'Pérola 🤍', emoji: '🦀',
    datas: '21/06 – 22/07',
    descricao: 'Intuitivo, carinhoso e protetor. Cancerianos têm uma conexão profunda com a família e expressam seu amor de forma única e especial.',
  },
  {
    nome: 'Leão', simbolo: '♌', elemento: 'Fogo 🔥', pedra: 'Rubi ❤️', emoji: '🦁',
    datas: '23/07 – 22/08',
    descricao: 'Generoso, criativo e carismático. Leoninos iluminam os ambientes com sua presença e têm um coração enorme para quem amam.',
  },
  {
    nome: 'Virgem', simbolo: '♍', elemento: 'Terra 🌍', pedra: 'Safira 💙', emoji: '👧',
    datas: '23/08 – 22/09',
    descricao: 'Analítico, dedicado e gentil. Virginianos prestam atenção nos detalhes e sempre buscam ajudar e melhorar tudo ao redor.',
  },
  {
    nome: 'Libra', simbolo: '♎', elemento: 'Ar 💨', pedra: 'Opala 🌈', emoji: '⚖️',
    datas: '23/09 – 22/10',
    descricao: 'Diplomático, justo e encantador. Librianos buscam harmonia e beleza em tudo, sendo naturalmente amáveis e equilibrados.',
  },
  {
    nome: 'Escorpião', simbolo: '♏', elemento: 'Água 💧', pedra: 'Topázio 🟡', emoji: '🦂',
    datas: '23/10 – 21/11',
    descricao: 'Intenso, apaixonado e perspicaz. Escorpianos possuem uma profundidade emocional rara e uma lealdade inabalável às pessoas que amam.',
  },
  {
    nome: 'Sagitário', simbolo: '♐', elemento: 'Fogo 🔥', pedra: 'Turquesa 🩵', emoji: '🏹',
    datas: '22/11 – 21/12',
    descricao: 'Aventureiro, otimista e filosófico. Sagitarianos amam a liberdade e têm uma visão expansiva do mundo, sempre em busca de novos horizontes.',
  },
  {
    nome: 'Capricórnio', simbolo: '♑', elemento: 'Terra 🌍', pedra: 'Granada 🔴', emoji: '🐐',
    datas: '22/12 – 19/01',
    descricao: 'Ambicioso, disciplinado e responsável. Capricornianos são persistentes e constroem com paciência tudo aquilo que desejam alcançar.',
  },
  {
    nome: 'Aquário', simbolo: '♒', elemento: 'Ar 💨', pedra: 'Ametista 💜', emoji: '🏺',
    datas: '20/01 – 18/02',
    descricao: 'Inovador, humanitário e original. Aquarianos pensam fora da caixa e têm um espírito livre que inspira todos ao redor.',
  },
  {
    nome: 'Peixes', simbolo: '♓', elemento: 'Água 💧', pedra: 'Aquamarina 🩵', emoji: '🐟',
    datas: '19/02 – 20/03',
    descricao: 'Sensível, criativo e empático. Piscinos têm uma imaginação vasta e uma capacidade única de sentir e conectar com as emoções alheias.',
  },
];

function getSigno(dataNascimento: string): ZodiacSign {
  const date = new Date(dataNascimento + 'T12:00');
  const dia = date.getDate();
  const mes = date.getMonth() + 1; // 1-12

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return SIGNOS[0];  // Áries
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return SIGNOS[1];  // Touro
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return SIGNOS[2];  // Gêmeos
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return SIGNOS[3];  // Câncer
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return SIGNOS[4];  // Leão
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return SIGNOS[5];  // Virgem
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return SIGNOS[6]; // Libra
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return SIGNOS[7];// Escorpião
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return SIGNOS[8];// Sagitário
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return SIGNOS[9]; // Capricórnio
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return SIGNOS[10]; // Aquário
  return SIGNOS[11]; // Peixes
}

/* ── Curiosidades ── */
interface Curiosidade {
  emoji: string;
  texto: string;
}

function ciclosLunares(diffMs: number): string {
  // Ciclo lunar = 29,53 dias
  const ciclos = diffMs / (1000 * 60 * 60 * 24 * 29.53);
  return ciclos.toFixed(1).replace('.', ',');
}

function getCuriosidades(dataNascimento: string, horaNascimento: string): Curiosidade[] {
  const birth = new Date(`${dataNascimento}T${horaNascimento}`);
  const now = new Date();
  const diffMs   = now.getTime() - birth.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);
  const diffHoras   = diffMs / (1000 * 60 * 60);
  const diffMinutos = diffMs / (1000 * 60);
  const diffAnos    = diffDias / 365.25;

  const anosCachorro = (diffAnos * 7).toFixed(1);
  const anosGato     = (diffAnos * 6).toFixed(1);
  const lunas        = ciclosLunares(diffMs);
  const horasDormindo = Math.round(diffHoras * 0.54).toLocaleString('pt-BR');
  const batimentos    = Math.round(diffMinutos * 130).toLocaleString('pt-BR');
  const voltasSol     = diffAnos.toFixed(2).replace('.', ',');
  const arvores = Math.round(diffMs / 1000 * 63).toLocaleString('pt-BR');

  let fraldas: number;
  if (diffDias <= 365) fraldas = Math.round(diffDias * 8);
  else fraldas = Math.round(365 * 8 + (diffDias - 365) * 4);

  let mamadas: number;
  if (diffDias <= 365) mamadas = Math.round(diffDias * 8);
  else mamadas = Math.round(365 * 8 + (diffDias - 365) * 5);

  return [
    { emoji: '🐶', texto: `${anosCachorro} anos em tempo de cachorro` },
    { emoji: '🐱', texto: `${anosGato} anos em tempo de gato` },
    { emoji: '🌙', texto: `${lunas} ciclos lunares completos` },
    { emoji: '😴', texto: `aproximadamente ${horasDormindo} horas dormindo` },
    { emoji: '❤️', texto: `cerca de ${batimentos} batimentos cardíacos` },
    { emoji: '🍼', texto: `aproximadamente ${fraldas.toLocaleString('pt-BR')} fraldas trocadas` },
    { emoji: '🥣', texto: `cerca de ${mamadas.toLocaleString('pt-BR')} refeições` },
    { emoji: '🌞', texto: `${voltasSol} voltas ao redor do Sol` },
    { emoji: '🌱', texto: `${arvores} árvores plantadas no mundo` },
  ];
}

function CuriosidadesCard({ dataNascimento, horaNascimento, nomeBebe, t }: {
  dataNascimento: string; horaNascimento: string;
  nomeBebe: string; t: typeof themes.menina;
}) {
  const curiosidades = getCuriosidades(dataNascimento, horaNascimento);

  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ display: 'inline-block', background: `linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius: 50, padding: '5px 18px', fontSize: '0.8rem', color: t.badgeColor, fontWeight: 700 }}>
          🧸 Curiosidades sobre {nomeBebe}
        </span>
      </div>

      <div style={{ background: 'white', borderRadius: 22, padding: '28px 24px', border: `1.5px solid ${t.border1}`, boxShadow: `0 4px 24px ${t.shadow}` }}>
        <p style={{ fontSize: '0.9rem', color: '#a08898', marginBottom: 20, textAlign: 'center', fontStyle: 'italic' }}>
          {nomeBebe} já viveu...
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {curiosidades.map((c, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 14,
                background: i % 2 === 0
                  ? `linear-gradient(135deg,${t.light}50,#ede9fe20)`
                  : `linear-gradient(135deg,#ede9fe20,${t.light}50)`,
                border: `1px solid ${t.border1}`,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(5px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)'; }}
            >
              <span style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}>{c.emoji}</span>
              <p style={{ fontSize: '0.92rem', color: '#4a3550', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{c.texto}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.7rem', color: '#c4b5c0', textAlign: 'center', marginTop: 18, fontStyle: 'italic' }}>
          * valores aproximados com base na data de nascimento
        </p>
      </div>
    </div>
  );
}

/* ── Componente Signo ── */
function SignoCard({ dataNascimento, t }: { dataNascimento: string; t: typeof themes.menina }) {
  const signo = getSigno(dataNascimento);

  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ display: 'inline-block', background: `linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius: 50, padding: '5px 18px', fontSize: '0.8rem', color: t.badgeColor, fontWeight: 700 }}>
          ✨ Signo do bebê
        </span>
      </div>

      <div style={{ background: 'white', borderRadius: 22, padding: '32px 28px', border: `1.5px solid ${t.border1}`, boxShadow: `0 4px 24px ${t.shadow}` }}>
        {/* Header do signo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg,${t.light},#ede9fe)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', border: `2px solid ${t.border1}`,
            boxShadow: `0 4px 16px ${t.shadow}`,
          }}>
            {signo.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, color: t.primary }}>{signo.simbolo}</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: '#2d1b2e' }}>{signo.nome}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a08898', fontWeight: 600 }}>{signo.datas}</span>
          </div>
        </div>

        {/* Descrição */}
        <p style={{ fontSize: '0.95rem', color: '#4a3550', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
          {signo.descricao}
        </p>

        {/* Elemento + Pedra */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            background: `linear-gradient(135deg,${t.light}60,#ede9fe60)`,
            borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${t.border1}`,
          }}>
            <p style={{ fontSize: '0.7rem', color: '#a08898', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Elemento</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2d1b2e' }}>{signo.elemento}</p>
          </div>
          <div style={{
            background: `linear-gradient(135deg,#ede9fe60,${t.light}60)`,
            borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${t.border2}`,
          }}>
            <p style={{ fontSize: '0.7rem', color: '#a08898', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Pedra</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2d1b2e' }}>{signo.pedra}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Página principal ── */
const UserPage: React.FC<PageProps> = ({ params }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const t = userData ? themes[userData.sexo ?? 'menina'] : themes.menina;

  useEffect(() => {
    const fetchData = async () => {
      const { slug: s } = await params;
      setSlug(s);
      const { data, error } = await supabase.from('users').select('*').eq('slug', s).single();
      if (error || !data) { console.error('Erro:', error); return; }
      setUserData(data as UserData);
      const qr = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${s}`,
        { width: 280, margin: 2, color: { dark: '#2d1b2e', light: '#ffffff' } }
      );
      setQrCodeUrl(qr);
    };
    fetchData();
  }, [params]);

  useEffect(() => {
    if (!userData) return;
    const birth = new Date(`${userData.dataNascimento}T${userData.horaNascimento}`);
    const tick = () => {
      const now = new Date();
      const diff = now.getTime() - birth.getTime();
      let years = now.getUTCFullYear() - birth.getUTCFullYear();
      let months = now.getUTCMonth() - birth.getUTCMonth();
      let days = now.getUTCDate() - birth.getUTCDate();
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (months < 0) { months += 12; years--; }
      if (days < 0) { const lm = new Date(now.getFullYear(), now.getMonth()-1, 0); days = lm.getDate()+days; months--; if (months<0){months=11;years--;} }
      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [userData]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    const auto = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { clearInterval(auto); emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!userData || userData.plano !== 'sempre') return;
    const handler = () => {
      const audio = document.getElementById('bg-audio') as HTMLAudioElement;
      if (audio) { audio.volume = 0.2; audio.play().catch(() => {}); }
      document.removeEventListener('click', handler);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userData]);

  const downloadQR = useCallback(() => {
    if (!qrCodeUrl || !slug) return;
    const a = document.createElement('a'); a.href = qrCodeUrl; a.download = `QRCode-${slug}.png`; a.click();
  }, [qrCodeUrl, slug]);

  if (!userData) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f7ff', fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🍼</div>
        <p style={{ color:'#3b82f6', fontWeight:600 }}>Carregando...</p>
      </div>
    </div>
  );

  const timeUnits = [
    { label:'Anos',     value: timeElapsed?.years },
    { label:'Meses',    value: timeElapsed?.months },
    { label:'Dias',     value: timeElapsed?.days },
    { label:'Horas',    value: timeElapsed?.hours },
    { label:'Minutos',  value: timeElapsed?.minutes },
    { label:'Segundos', value: timeElapsed?.seconds },
  ];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:'100vh', background: t.pageBg, color:'#2d1b2e', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .7s ease forwards; }
        .float   { animation: float 3s ease-in-out infinite; }
        .embla            { overflow:hidden; border-radius:20px; }
        .embla__container { display:flex; }
        .embla__slide     { flex:0 0 100%; }
      `}</style>

      {userData.plano === 'sempre' && <audio id="bg-audio" loop><source src="/rugrats.mp3" type="audio/mp3"/></audio>}

      {/* ── HERO ── */}
      <div style={{ position:'relative', overflow:'hidden', padding:'64px 24px 48px', textAlign:'center', background: t.heroBg, borderBottom:`1px solid ${t.border1}` }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:260, height:260, background:`radial-gradient(circle,${t.blobColor1},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, background:`radial-gradient(circle,${t.blobColor2},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
        <div className="float" style={{ fontSize:56, marginBottom:16 }}>{userData.sexo === 'menino' ? '👦' : '👧'}</div>
        <h1 className="pf fade-up" style={{ fontSize:'clamp(2.4rem,8vw,4rem)', fontWeight:700, lineHeight:1.1, marginBottom:12 }}>{userData.nomeBebe}</h1>
        <p style={{ color:'#a08898', fontSize:'0.9rem', marginBottom:10 }}>
          Nasceu em {new Date(`${userData.dataNascimento}T12:00`).toLocaleDateString('pt-BR',{ day:'2-digit', month:'long', year:'numeric' })} às {userData.horaNascimento}
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'4px 16px', fontSize:'0.75rem', fontWeight:700, color: t.badgeColor }}>
            {t.emoji} {userData.sexo === 'menino' ? 'Menino' : 'Menina'}
          </span>
          {userData.plano === 'sempre' && (
            <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'4px 16px', fontSize:'0.75rem', fontWeight:700, color: t.badgeColor }}>
              🎵 Toque para ouvir
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'48px 20px 80px' }}>

        {/* ── CAROUSEL ── */}
        {userData.fotos.length > 0 && (
          <div style={{ marginBottom:56 }}>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {userData.fotos.map((url,i) => (
                  <div key={i} className="embla__slide">
                    <img src={url} alt={`Foto ${i+1}`} style={{ width:'100%', maxHeight:480, objectFit:'cover', borderRadius:20, border:`2px solid ${t.border1}`, boxShadow:`0 8px 32px ${t.shadow}` }} />
                  </div>
                ))}
              </div>
            </div>
            {userData.fotos.length > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:14 }}>
                {userData.fotos.map((_,i) => (
                  <button key={i} onClick={() => emblaApi?.scrollTo(i)} style={{ width: i===selectedIndex?20:8, height:8, borderRadius:99, border:'none', cursor:'pointer', background: i===selectedIndex ? t.gradient : t.light, transition:'all 0.3s', padding:0 }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COUNTDOWN ── */}
        {timeElapsed && (
          <div style={{ marginBottom:56 }}>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color: t.badgeColor, fontWeight:700 }}>⏱ Tempo de vida</span>
            </div>
            <div style={{ background:'white', borderRadius:22, padding:'28px 20px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, marginBottom:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {timeUnits.slice(0,3).map(({ label, value }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div className="pf" style={{ fontSize:'2.4rem', fontWeight:700, color: t.countColor1, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:'0.75rem', color:'#a08898', marginTop:4, fontWeight:600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: t.cardBg2, borderRadius:22, padding:'28px 20px', border:`1.5px solid ${t.border2}`, boxShadow:'0 4px 24px rgba(196,181,253,0.15)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {timeUnits.slice(3).map(({ label, value }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div className="pf" style={{ fontSize:'2.4rem', fontWeight:700, color: t.countColor2, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:'0.75rem', color:'#a08898', marginTop:4, fontWeight:600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SIGNO ── */}
        <SignoCard dataNascimento={userData.dataNascimento} t={t} />

        {/* ── CURIOSIDADES ── */}
        <CuriosidadesCard
          dataNascimento={userData.dataNascimento}
          horaNascimento={userData.horaNascimento}
          nomeBebe={userData.nomeBebe}
          t={t}
        />

        {/* ── MENSAGEM ── */}
        <div style={{ marginBottom:56 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color: t.badgeColor, fontWeight:700 }}>💌 Mensagem de {userData.nomePais}</span>
          </div>
          <div style={{ background:'white', borderRadius:22, padding:'32px 28px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, position:'relative' }}>
            <div style={{ position:'absolute', top:16, left:20, fontFamily:"'Playfair Display',serif", fontSize:'4rem', color: t.quoteColor, lineHeight:1, userSelect:'none' }}>"</div>
            <p style={{ fontSize:'1.05rem', color:'#4a3550', lineHeight:1.8, fontStyle:'italic', textAlign:'center', paddingTop:16, position:'relative' }}>{userData.mensagem}</p>
            <div style={{ position:'absolute', bottom:8, right:20, fontFamily:"'Playfair Display',serif", fontSize:'4rem', color: t.quoteColor, lineHeight:1, userSelect:'none' }}>"</div>
          </div>
        </div>

        {/* ── QR CODE ── */}
        {qrCodeUrl && (
          <div style={{ textAlign:'center' }}>
            <div style={{ marginBottom:20 }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color: t.badgeColor, fontWeight:700 }}>📱 Seu QR Code exclusivo</span>
            </div>
            <div style={{ background:'white', borderRadius:22, padding:'32px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, display:'inline-block' }}>
              <img src={qrCodeUrl} alt="QR Code" style={{ width:200, height:200, borderRadius:12, display:'block', margin:'0 auto 16px' }} />
              <p style={{ color:'#a08898', fontSize:'0.78rem', marginBottom:16 }}>Escaneie para acessar esta página</p>
              <button onClick={downloadQR}
                style={{ background: t.gradient, color:'white', border:'none', padding:'12px 32px', borderRadius:50, fontSize:'0.9rem', fontWeight:700, cursor:'pointer', boxShadow:`0 6px 20px ${t.shadow}`, fontFamily:"'Nunito',sans-serif", transition:'transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >
                Baixar QR Code {t.emoji}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#2d1b2e', padding:'32px 24px', textAlign:'center' }}>
        <img src="/chupeta.png" alt="BabyTimee" style={{ width:32, height:32, objectFit:'contain', margin:'0 auto 8px', display:'block' }} />
        <p className="pf" style={{ color: t.footerName, fontWeight:700, marginBottom:4 }}>BabyTimee</p>
        <p style={{ color:'#6b5c6e', fontSize:'0.72rem' }}>Copyright © 2026 BabyTimee · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default UserPage;