'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import QRCode from 'qrcode';

interface UserData {
  nomeBebe: string; nomePais: string; dataNascimento: string;
  horaNascimento: string; mensagem: string; plano: string;
  fotos: string[]; sexo: 'menino' | 'menina';
}
interface TimeElapsed {
  years: number; months: number; days: number;
  hours: number; minutes: number; seconds: number;
}

/* ── POST-IT ── */
interface Postit {
  id: number;
  nome: string;
  mensagem: string;
  cor: string;
  created_at: string;
}

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
    cor:'#3b82f6', badge:'#dbeafe', dark:'#1d4ed8',
    ebookAccent:'#3b82f6',
    ebookGradient:'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)',
    ebookShadow:'rgba(96,165,250,0.35)',
    ebookBadgeColor:'#1d4ed8',
    ebookChapBg0:'linear-gradient(135deg,#dbeafe50,#ede9fe30)',
    ebookChapBg1:'linear-gradient(135deg,#ede9fe30,#dbeafe50)',
    ebookStatBg:'linear-gradient(135deg,#dbeafe50,#ede9fe40)',
    ebookBtnEmoji:'💙',
    ebookHeroBg:'linear-gradient(155deg,#e0f0ff 0%,#dbeafe 50%,#ede9fe 100%)',
    ebookBookGradient:'linear-gradient(155deg,#60a5fa,#3b82f6,#4f46e5)',
    ebookBookShadow:'rgba(96,165,250,0.45)',
    ebookStatColor:'#3b82f6',
    postitBtnBg:'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)',
    postitBtnText:'white',
    postitBtnShadow:'rgba(96,165,250,0.4)',
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
    cor:'#e879a0', badge:'#fce4ef', dark:'#c0507a',
    ebookAccent:'#e879a0',
    ebookGradient:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
    ebookShadow:'rgba(232,121,160,0.35)',
    ebookBadgeColor:'#c0507a',
    ebookChapBg0:'linear-gradient(135deg,#fce4ef50,#ede9fe30)',
    ebookChapBg1:'linear-gradient(135deg,#ede9fe30,#fce4ef50)',
    ebookStatBg:'linear-gradient(135deg,#fce4ef50,#ede9fe40)',
    ebookBtnEmoji:'💗',
    ebookHeroBg:'linear-gradient(155deg,#fff5f8 0%,#fce4ef 50%,#ede9fe 100%)',
    ebookBookGradient:'linear-gradient(155deg,#f9a8c9,#e879a0,#d1598c)',
    ebookBookShadow:'rgba(200,80,130,0.45)',
    ebookStatColor:'#e879a0',
    postitBtnBg:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
    postitBtnText:'white',
    postitBtnShadow:'rgba(232,121,160,0.4)',
  },
};

type Tema = typeof themes.menina;

/* ── Galeria carrossel centralizado ── */
function GaleriaCarrossel({ fotos, tema }: { fotos: string[]; tema: Tema }) {
  const [active, setActive]     = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (fotos.length <= 1) return;
    const timer = setInterval(() => setActive(i => (i + 1) % fotos.length), 5000);
    return () => clearInterval(timer);
  }, [fotos.length]);

  const startX   = useRef(0);
  const dragging = useRef(false);
  const prev = () => setActive(i => (i - 1 + fotos.length) % fotos.length);
  const next = () => setActive(i => (i + 1) % fotos.length);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
  };

  const len   = fotos.length;
  const iPrev = (active - 1 + len) % len;
  const iNext = (active + 1) % len;
  const visible = len === 1
    ? [{ idx: active, pos: 'center' }]
    : len === 2
    ? [{ idx: iPrev, pos: 'left' }, { idx: active, pos: 'center' }]
    : [
        { idx: iPrev,  pos: 'left'   },
        { idx: active, pos: 'center' },
        { idx: iNext,  pos: 'right'  },
      ];

  const styleFor = (pos: string): React.CSSProperties => {
    if (pos === 'center') return {
      width: isMobile ? '78%' : '68%',
      height: isMobile ? 300 : 440,
      borderRadius: 18, objectFit: 'cover',
      boxShadow: `0 12px 40px ${tema.cor}40`,
      border: `2px solid ${tema.cor}40`,
      transform: 'scale(1)', opacity: 1, zIndex: 2,
      cursor: 'default',
      transition: 'all .4s cubic-bezier(.22,1,.36,1)',
      flexShrink: 0,
    };
    return {
      width: isMobile ? '14%' : '28%',
      height: isMobile ? 240 : 320,
      borderRadius: isMobile ? 10 : 14,
      objectFit: 'cover',
      border: `1.5px solid ${tema.light}`,
      transform: pos === 'left'
        ? isMobile ? 'scale(0.85) translateX(32px)' : 'scale(0.88) translateX(12px)'
        : isMobile ? 'scale(0.85) translateX(-32px)' : 'scale(0.88) translateX(-12px)',
      opacity: isMobile ? 0.3 : 0.55,
      zIndex: 1, cursor: 'pointer',
      transition: 'all .4s cubic-bezier(.22,1,.36,1)',
      flexShrink: 0,
    };
  };

  return (
    <div style={{ marginBottom: 56 }}>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: isMobile ? 4 : 12, overflow:'hidden', userSelect:'none', touchAction:'pan-y' }}
      >
        {visible.map(({ idx, pos }) => (
          <img
            key={idx}
            src={fotos[idx]}
            alt={`Foto ${idx + 1}`}
            style={styleFor(pos)}
            onClick={() => pos === 'center' ? setLightbox(true) : (pos === 'left' ? prev() : next())}
            draggable={false}
          />
        ))}
      </div>

      {len > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:16 }}>
          {fotos.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 20 : 8, height: 8,
              borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
              background: i === active ? tema.gradient : tema.light,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      )}

      {lightbox && (() => {
        const lbStartX = { current: 0 };
        return (
          <div
            onClick={() => setLightbox(false)}
            onPointerDown={(e) => { lbStartX.current = e.clientX; }}
            onPointerUp={(e) => {
              const dx = e.clientX - lbStartX.current;
              if (Math.abs(dx) > 40) { e.stopPropagation(); if (dx < 0) next(); else prev(); }
            }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, touchAction:'pan-y' }}
          >
            {len > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:44, height:44, fontSize:'1.4rem', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:44, height:44, fontSize:'1.4rem', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
              </>
            )}
            <img src={fotos[active]} alt="Foto ampliada" onClick={(e) => e.stopPropagation()} style={{ maxWidth:'100%', maxHeight:'90vh', borderRadius:16, objectFit:'contain', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }} />
            {len > 1 && (
              <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>{active+1} / {len}</div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

/* ── Signos ── */
interface ZodiacSign { nome:string; simbolo:string; elemento:string; pedra:string; descricao:string; emoji:string; datas:string; }
const SIGNOS: ZodiacSign[] = [
  { nome:'Áries',      simbolo:'♈', elemento:'Fogo 🔥',  pedra:'Diamante 💎',  emoji:'🐏', datas:'21/03 – 19/04', descricao:'Corajoso, pioneiro e cheio de energia. Arianos são líderes natos, movidos pela paixão e pela vontade de conquistar o mundo com entusiasmo.' },
  { nome:'Touro',      simbolo:'♉', elemento:'Terra 🌍', pedra:'Esmeralda 💚', emoji:'🐂', datas:'20/04 – 20/05', descricao:'Determinado, leal e amante da beleza. Taurinos são estáveis e persistentes, encontrando alegria nas pequenas delícias da vida.' },
  { nome:'Gêmeos',     simbolo:'♊', elemento:'Ar 💨',    pedra:'Ágata 🔵',     emoji:'👯', datas:'21/05 – 20/06', descricao:'Curioso, comunicativo e versátil. Geminianos adoram aprender e compartilhar, adaptando-se com facilidade a qualquer situação.' },
  { nome:'Câncer',     simbolo:'♋', elemento:'Água 💧',  pedra:'Pérola 🤍',    emoji:'🦀', datas:'21/06 – 22/07', descricao:'Intuitivo, carinhoso e protetor. Cancerianos têm uma conexão profunda com a família e expressam seu amor de forma única e especial.' },
  { nome:'Leão',       simbolo:'♌', elemento:'Fogo 🔥',  pedra:'Rubi ❤️',      emoji:'🦁', datas:'23/07 – 22/08', descricao:'Generoso, criativo e carismático. Leoninos iluminam os ambientes com sua presença e têm um coração enorme para quem amam.' },
  { nome:'Virgem',     simbolo:'♍', elemento:'Terra 🌍', pedra:'Safira 💙',    emoji:'👧', datas:'23/08 – 22/09', descricao:'Analítico, dedicado e gentil. Virginianos prestam atenção nos detalhes e sempre buscam ajudar e melhorar tudo ao redor.' },
  { nome:'Libra',      simbolo:'♎', elemento:'Ar 💨',    pedra:'Opala 🌈',     emoji:'⚖️', datas:'23/09 – 22/10', descricao:'Diplomático, justo e encantador. Librianos buscam harmonia e beleza em tudo, sendo naturalmente amáveis e equilibrados.' },
  { nome:'Escorpião',  simbolo:'♏', elemento:'Água 💧',  pedra:'Topázio 🟡',   emoji:'🦂', datas:'23/10 – 21/11', descricao:'Intenso, apaixonado e perspicaz. Escorpianos possuem uma profundidade emocional rara e uma lealdade inabalável às pessoas que amam.' },
  { nome:'Sagitário',  simbolo:'♐', elemento:'Fogo 🔥',  pedra:'Turquesa 🩵',  emoji:'🏹', datas:'22/11 – 21/12', descricao:'Aventureiro, otimista e filosófico. Sagitarianos amam a liberdade e têm uma visão expansiva do mundo, sempre em busca de novos horizontes.' },
  { nome:'Capricórnio',simbolo:'♑', elemento:'Terra 🌍', pedra:'Granada 🔴',   emoji:'🐐', datas:'22/12 – 19/01', descricao:'Ambicioso, disciplinado e responsável. Capricornianos são persistentes e constroem com paciência tudo aquilo que desejam alcançar.' },
  { nome:'Aquário',    simbolo:'♒', elemento:'Ar 💨',    pedra:'Ametista 💜',  emoji:'🏺', datas:'20/01 – 18/02', descricao:'Inovador, humanitário e original. Aquarianos pensam fora da caixa e têm um espírito livre que inspira todos ao redor.' },
  { nome:'Peixes',     simbolo:'♓', elemento:'Água 💧',  pedra:'Aquamarina 🩵',emoji:'🐟', datas:'19/02 – 20/03', descricao:'Sensível, criativo e empático. Piscinos têm uma imaginação vasta e uma capacidade única de sentir e conectar com as emoções alheias.' },
];
function getSigno(dataNascimento: string): ZodiacSign {
  const date = new Date(dataNascimento + 'T12:00');
  const dia = date.getDate(), mes = date.getMonth() + 1;
  if ((mes===3&&dia>=21)||(mes===4&&dia<=19)) return SIGNOS[0];
  if ((mes===4&&dia>=20)||(mes===5&&dia<=20)) return SIGNOS[1];
  if ((mes===5&&dia>=21)||(mes===6&&dia<=20)) return SIGNOS[2];
  if ((mes===6&&dia>=21)||(mes===7&&dia<=22)) return SIGNOS[3];
  if ((mes===7&&dia>=23)||(mes===8&&dia<=22)) return SIGNOS[4];
  if ((mes===8&&dia>=23)||(mes===9&&dia<=22)) return SIGNOS[5];
  if ((mes===9&&dia>=23)||(mes===10&&dia<=22)) return SIGNOS[6];
  if ((mes===10&&dia>=23)||(mes===11&&dia<=21)) return SIGNOS[7];
  if ((mes===11&&dia>=22)||(mes===12&&dia<=21)) return SIGNOS[8];
  if ((mes===12&&dia>=22)||(mes===1&&dia<=19)) return SIGNOS[9];
  if ((mes===1&&dia>=20)||(mes===2&&dia<=18)) return SIGNOS[10];
  return SIGNOS[11];
}

/* ── Curiosidades ── */
function getCuriosidades(dataNascimento: string, horaNascimento: string) {
  const birth = new Date(`${dataNascimento}T${horaNascimento}`);
  const now = new Date();
  const diffMs      = now.getTime() - birth.getTime();
  const diffDias    = diffMs / (1000*60*60*24);
  const diffHoras   = diffMs / (1000*60*60);
  const diffMinutos = diffMs / (1000*60);
  const diffAnos    = diffDias / 365.25;
  const fraldas = diffDias<=365 ? Math.round(diffDias*8) : Math.round(365*8+(diffDias-365)*4);
  const mamadas = diffDias<=365 ? Math.round(diffDias*8) : Math.round(365*8+(diffDias-365)*5);
  return [
    { emoji:'🐶', texto:`${(diffAnos*7).toFixed(1)} anos em tempo de cachorro` },
    { emoji:'🐱', texto:`${(diffAnos*6).toFixed(1)} anos em tempo de gato` },
    { emoji:'🌙', texto:`${(diffMs/(1000*60*60*24*29.53)).toFixed(1).replace('.',',')} ciclos lunares completos` },
    { emoji:'😴', texto:`aproximadamente ${Math.round(diffHoras*0.54).toLocaleString('pt-BR')} horas dormindo` },
    { emoji:'❤️', texto:`cerca de ${Math.round(diffMinutos*130).toLocaleString('pt-BR')} batimentos cardíacos` },
    { emoji:'🍼', texto:`aproximadamente ${fraldas.toLocaleString('pt-BR')} fraldas trocadas` },
    { emoji:'🥣', texto:`cerca de ${mamadas.toLocaleString('pt-BR')} refeições` },
    { emoji:'🌞', texto:`${diffAnos.toFixed(2).replace('.',',')} voltas ao redor do Sol` },
    { emoji:'🌱', texto:`${Math.round(diffMs/1000*63).toLocaleString('pt-BR')} árvores plantadas no mundo` },
  ];
}

function CuriosidadesCard({ dataNascimento, horaNascimento, nomeBebe, t }: { dataNascimento:string; horaNascimento:string; nomeBebe:string; t:Tema }) {
  const curiosidades = getCuriosidades(dataNascimento, horaNascimento);
  return (
    <div style={{ marginBottom:56 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>🧸 Curiosidades sobre {nomeBebe}</span>
      </div>
      <div style={{ background:'white', borderRadius:22, padding:'28px 24px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}` }}>
        <p style={{ fontSize:'0.9rem', color:'#a08898', marginBottom:20, textAlign:'center', fontStyle:'italic' }}>{nomeBebe} já viveu...</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {curiosidades.map((c,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 16px', borderRadius:14, background: i%2===0 ? `linear-gradient(135deg,${t.light}50,#ede9fe20)` : `linear-gradient(135deg,#ede9fe20,${t.light}50)`, border:`1px solid ${t.border1}` }}>
              <span style={{ fontSize:'1.5rem', flexShrink:0, lineHeight:1 }}>{c.emoji}</span>
              <p style={{ fontSize:'0.92rem', color:'#4a3550', fontWeight:500, margin:0, lineHeight:1.4 }}>{c.texto}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'0.7rem', color:'#c4b5c0', textAlign:'center', marginTop:18, fontStyle:'italic' }}>* valores aproximados com base na data de nascimento</p>
      </div>
    </div>
  );
}

function SignoCard({ dataNascimento, t }: { dataNascimento:string; t:Tema }) {
  const signo = getSigno(dataNascimento);
  return (
    <div style={{ marginBottom:56 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>✨ Signo do bebê</span>
      </div>
      <div style={{ background:'white', borderRadius:22, padding:'32px 28px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <div style={{ width:70, height:70, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${t.light},#ede9fe)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', border:`2px solid ${t.border1}`, boxShadow:`0 4px 16px ${t.shadow}` }}>{signo.emoji}</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:700, color:t.primary }}>{signo.simbolo}</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:'#2d1b2e' }}>{signo.nome}</span>
            </div>
            <span style={{ fontSize:'0.75rem', color:'#a08898', fontWeight:600 }}>{signo.datas}</span>
          </div>
        </div>
        <p style={{ fontSize:'0.95rem', color:'#4a3550', lineHeight:1.75, marginBottom:20, fontStyle:'italic' }}>{signo.descricao}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div style={{ background:`linear-gradient(135deg,${t.light}60,#ede9fe60)`, borderRadius:14, padding:'14px 16px', border:`1px solid ${t.border1}` }}>
            <p style={{ fontSize:'0.7rem', color:'#a08898', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Elemento</p>
            <p style={{ fontSize:'1rem', fontWeight:700, color:'#2d1b2e' }}>{signo.elemento}</p>
          </div>
          <div style={{ background:`linear-gradient(135deg,#ede9fe60,${t.light}60)`, borderRadius:14, padding:'14px 16px', border:`1px solid ${t.border2}` }}>
            <p style={{ fontSize:'0.7rem', color:'#a08898', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Pedra</p>
            <p style={{ fontSize:'1rem', fontWeight:700, color:'#2d1b2e' }}>{signo.pedra}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Seção E-book ── */
function EbookCard({ t, nomeBebe, onDownload }: { t: Tema; nomeBebe: string; onDownload: () => void }) {
  const capitulos = [
    { emoji:'🍼', titulo:'Enxoval Inteligente',       sub:'O que é essencial de verdade no começo' },
    { emoji:'🌙', titulo:'Sono & Segurança',           sub:'Rotinas e ambiente seguro para dormir' },
    { emoji:'🤱', titulo:'Amamentação & Nutrição',     sub:'Primeiros passos e dificuldades comuns' },
    { emoji:'💉', titulo:'Vacinas & Cuidados Médicos', sub:'Calendário, sinais de alerta e consultas' },
  ];
  return (
    <div style={{ marginBottom:56 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.ebookBadgeColor, fontWeight:700 }}>📖 E-book gratuito para você</span>
      </div>
      <div style={{ background:'white', borderRadius:24, border:`1.5px solid ${t.border1}`, boxShadow:`0 8px 32px ${t.ebookShadow}`, overflow:'hidden' }}>
        <div style={{ background:t.ebookHeroBg, padding:'36px 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, background:`radial-gradient(circle,${t.blobColor1},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, background:`radial-gradient(circle,${t.blobColor2},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:24, position:'relative' }}>
            <div style={{ flexShrink:0 }}>
              <div style={{ width:88, height:118, background:t.ebookBookGradient, borderRadius:'6px 12px 12px 6px', boxShadow:`4px 8px 24px ${t.ebookBookShadow}, inset -3px 0 8px rgba(0,0,0,0.18)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, position:'relative' }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:7, background:'rgba(0,0,0,0.22)', borderRadius:'6px 0 0 6px' }} />
                <div style={{ position:'absolute', top:8, left:14, right:8, height:1, background:'rgba(255,255,255,0.3)', borderRadius:99 }} />
                <span style={{ fontSize:'1.5rem', filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}>🍼</span>
                <div style={{ textAlign:'center', padding:'0 10px' }}>
                  <p style={{ fontFamily:"'Playfair Display',serif", color:'white', fontSize:'0.48rem', fontWeight:700, lineHeight:1.35, margin:0, textShadow:'0 1px 3px rgba(0,0,0,0.3)' }}>Meu Primeiro Ano</p>
                  <div style={{ width:28, height:1, background:'rgba(255,255,255,0.45)', margin:'4px auto' }} />
                  <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.36rem', margin:0, letterSpacing:'0.06em', fontFamily:"'Nunito',sans-serif" }}>GUIA PARA MÃES</p>
                </div>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.7rem', color:t.ebookBadgeColor, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 6px' }}>E-book gratuito</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.35rem', color:'#2d1b2e', lineHeight:1.25, margin:'0 0 10px' }}>
                Meu Primeiro Ano<br />
                <em style={{ color:t.ebookAccent }}>— Guia para Mães de Primeira Viagem</em>
              </h2>
              <p style={{ fontSize:'0.82rem', color:'#a08898', lineHeight:1.55, margin:0 }}>
                Tudo o que você precisa saber sobre o primeiro ano de {nomeBebe}, com carinho e leveza.
              </p>
            </div>
          </div>
        </div>
        <div style={{ padding:'24px 28px 24px' }}>
          <p style={{ fontSize:'0.7rem', color:'#a08898', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 12px' }}>O que você vai encontrar</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            {capitulos.map((cap, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:14, background:i%2===0?t.ebookChapBg0:t.ebookChapBg1, border:`1px solid ${t.border1}` }}>
                <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{cap.emoji}</span>
                <div>
                  <p style={{ fontSize:'0.87rem', fontWeight:700, color:'#2d1b2e', margin:0, lineHeight:1.25 }}>{cap.titulo}</p>
                  <p style={{ fontSize:'0.73rem', color:'#a08898', margin:0, marginTop:1 }}>{cap.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:24 }}>
            {[{ val:'10', label:'min de leitura' },{ val:'12', label:'capítulos' },{ val:'100%', label:'gratuito' }].map(({ val, label }) => (
              <div key={label} style={{ textAlign:'center', padding:'12px 8px', background:t.ebookStatBg, borderRadius:14, border:`1px solid ${t.border1}` }}>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:t.ebookStatColor, margin:0, lineHeight:1 }}>{val}</p>
                <p style={{ fontSize:'0.68rem', color:'#a08898', margin:0, fontWeight:600, marginTop:3 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Botão chama o modal de autenticação ao invés de baixar direto */}
          <button
            onClick={onDownload}
            style={{
              width:'100%', padding:'15px', borderRadius:50, border:'none',
              background:t.ebookGradient, color:'white', fontWeight:700,
              fontSize:'1rem', fontFamily:"'Nunito',sans-serif", cursor:'pointer',
              boxShadow:`0 6px 22px ${t.ebookShadow}`,
              transition:'transform 0.2s, box-shadow 0.2s', letterSpacing:'0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 10px 30px ${t.ebookShadow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 6px 22px ${t.ebookShadow}`; }}
          >
            {t.ebookBtnEmoji} Baixar e-book gratuito (PDF)
          </button>
          <p style={{ textAlign:'center', fontSize:'0.7rem', color:'#c4b5c0', margin:'10px 0 0', fontStyle:'italic' }}>PDF leve · sem cadastro · compartilhe com quem você ama 🌸</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ── SEÇÃO DE POST-ITS ──
══════════════════════════════════════════════ */
function PostitsSection({ slug, nomeBebe, t }: { slug: string; nomeBebe: string; t: Tema }) {
  const [postits, setPostits]     = useState<Postit[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [nome, setNome]           = useState('');
  const [msg, setMsg]             = useState('');
  const [cor, setCor]             = useState('amarelo');
  const [sending, setSending]     = useState(false);
  const [erro, setErro]           = useState('');

  const CORES = [
    { id:'amarelo', bg:'#fef08a' },
    { id:'rosa',    bg:'#f9a8d4' },
    { id:'verde',   bg:'#86efac' },
    { id:'azul',    bg:'#93c5fd' },
    { id:'roxo',    bg:'#d8b4fe' },
    { id:'laranja', bg:'#fdba74' },
  ];

  const COR_MAP: Record<string, [string, string]> = {
    amarelo: ['#fef08a', '#713f12'],
    rosa:    ['#f9a8d4', '#831843'],
    verde:   ['#86efac', '#14532d'],
    azul:    ['#93c5fd', '#1e3a8a'],
    roxo:    ['#d8b4fe', '#3b0764'],
    laranja: ['#fdba74', '#7c2d12'],
  };

  const ROT = [-2, 1.5, -1, 2, -0.5, 1];

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`/api/baby-postits?slug=${slug}`);
        const data = await res.json();
        if (data.postits) setPostits(data.postits);
      } finally { setLoading(false); }
    })();
  }, [slug]);

  const enviar = async () => {
    if (!msg.trim()) { setErro('Escreva uma mensagem.'); return; }
    setSending(true); setErro('');
    try {
      const res  = await fetch('/api/baby-postits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, nome, mensagem: msg, cor }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error || 'Erro ao enviar.'); return; }
      setPostits(p => [data.postit, ...p]);
      setMsg(''); setNome(''); setShowForm(false);
    } catch { setErro('Erro de conexão.'); }
    finally { setSending(false); }
  };

  return (
    <div style={{ marginBottom:56 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>
          📌 Recados para {nomeBebe}
        </span>
      </div>
      <p style={{ textAlign:'center', fontSize:'0.88rem', color:'#a08898', marginBottom:20, lineHeight:1.6 }}>
        Deixe um recado carinhoso — {nomeBebe} vai guardar para sempre {t.emoji}
      </p>
      {!showForm && (
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{ background:t.postitBtnBg, border:'none', borderRadius:50, padding:'13px 32px', cursor:'pointer', color:t.postitBtnText, fontWeight:700, fontSize:'0.95rem', fontFamily:"'Nunito',sans-serif", boxShadow:`0 6px 22px ${t.postitBtnShadow}`, transition:'transform .2s, box-shadow .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 10px 30px ${t.postitBtnShadow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 6px 22px ${t.postitBtnShadow}`; }}
          >
            ✍️ Escrever recado
          </button>
        </div>
      )}
      {showForm && (
        <div style={{ background:'white', borderRadius:22, padding:'24px', border:`1.5px solid ${t.border1}`, boxShadow:`0 8px 32px ${t.shadow}`, marginBottom:24 }}>
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:'0.78rem', color:'#a08898', marginRight:4, fontWeight:600 }}>Cor do papel:</span>
            {CORES.map(c => (
              <button key={c.id} type="button" onClick={() => setCor(c.id)} style={{
                width:28, height:28, borderRadius:'50%', border:'none', cursor:'pointer',
                background:c.bg,
                outline: cor===c.id ? '3px solid rgba(100,100,100,.45)' : '2px solid transparent',
                outlineOffset:2,
                transform: cor===c.id ? 'scale(1.2)' : 'scale(1)',
                transition:'all .2s',
                boxShadow:'0 2px 8px rgba(0,0,0,.15)',
              }} />
            ))}
          </div>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${t.border1}`, fontSize:'0.9rem', fontFamily:"'Nunito',sans-serif", outline:'none', marginBottom:10, boxSizing:'border-box', color:'#2d1b2e' } as React.CSSProperties}
          />
          <textarea
            placeholder={`Escreva seu recado para ${nomeBebe}... (máx. 200 caracteres)`}
            value={msg}
            onChange={e => { setMsg(e.target.value.slice(0,200)); setErro(''); }}
            rows={3}
            style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${t.border1}`, fontSize:'0.9rem', fontFamily:"'Nunito',sans-serif", outline:'none', resize:'none', boxSizing:'border-box', marginBottom:6, color:'#2d1b2e' } as React.CSSProperties}
          />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <span style={{ fontSize:'0.72rem', color:'#a08898' }}>{msg.length}/200</span>
            {erro && <span style={{ fontSize:'0.75rem', color:t.primary, fontWeight:600 }}>{erro}</span>}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button
              onClick={() => { setShowForm(false); setMsg(''); setNome(''); setErro(''); }}
              style={{ flex:1, padding:'11px', background:'#f7f3f5', border:`1px solid ${t.border1}`, borderRadius:50, cursor:'pointer', color:'#a08898', fontWeight:700, fontSize:'0.88rem', fontFamily:"'Nunito',sans-serif" }}
            >Cancelar</button>
            <button
              onClick={enviar}
              disabled={sending}
              style={{ flex:2, padding:'11px', background:t.postitBtnBg, border:'none', borderRadius:50, cursor:sending?'wait':'pointer', color:t.postitBtnText, fontWeight:700, fontSize:'0.9rem', fontFamily:"'Nunito',sans-serif", boxShadow:`0 4px 14px ${t.postitBtnShadow}` }}
            >{sending ? 'Enviando...' : '📌 Colar recado'}</button>
          </div>
        </div>
      )}
      {loading ? (
        <div style={{ textAlign:'center', padding:'24px', opacity:.5 }}>
          <p style={{ fontSize:'0.88rem', color:'#a08898' }}>Carregando recados...</p>
        </div>
      ) : postits.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:14 }}>
          {postits.map((pt, i) => {
            const [bg, txt] = COR_MAP[pt.cor] || COR_MAP['amarelo'];
            const rot = ROT[i % ROT.length];
            return (
              <div
                key={pt.id}
                style={{ background:bg, borderRadius:3, padding:'14px 12px 18px', transform:`rotate(${rot}deg)`, boxShadow:'3px 4px 12px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.08)', position:'relative', transition:'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='rotate(0deg) scale(1.04)'; (e.currentTarget as HTMLDivElement).style.boxShadow='4px 8px 20px rgba(0,0,0,.22)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform=`rotate(${rot}deg)`; (e.currentTarget as HTMLDivElement).style.boxShadow='3px 4px 12px rgba(0,0,0,.18)'; }}
              >
                <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', width:40, height:16, background:'rgba(255,255,255,.5)', borderRadius:2, boxShadow:'0 1px 3px rgba(0,0,0,.08)' }} />
                <p style={{ fontFamily:"'Kalam',cursive", fontSize:'13px', color:txt, lineHeight:1.65, marginBottom:10, marginTop:4 }}>
                  {pt.mensagem}
                </p>
                {pt.nome && pt.nome !== 'Anônimo' && (
                  <span style={{ fontFamily:"'Kalam',cursive", fontSize:'11px', color:txt, opacity:.65 }}>
                    — {pt.nome}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'32px 20px', background:'white', borderRadius:18, border:`1.5px dashed ${t.border1}` }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🏷️</div>
          <p style={{ fontSize:'0.88rem', color:'#a08898' }}>Nenhum recado ainda. Seja o primeiro! {t.emoji}</p>
        </div>
      )}
    </div>
  );
}

/* ── Página principal ── */
interface PageProps { params: Promise<{ slug: string }>; }

const UserPage = ({ params }: PageProps) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed | null>(null);
  const [editMode, setEditMode]       = useState(false);
  const [authModal, setAuthModal]     = useState(false);
  const [authEmail, setAuthEmail]     = useState('');
  const [authError, setAuthError]     = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [fotosEdit, setFotosEdit]     = useState<string[]>([]);

  /* ── Estados do modal de e-book ── */
  const [ebookModal, setEbookModal]     = useState(false);
  const [ebookEmail, setEbookEmail]     = useState('');
  const [ebookError, setEbookError]     = useState('');
  const [ebookLoading, setEbookLoading] = useState(false);

  const t = userData ? themes[userData.sexo ?? 'menina'] : themes.menina;

  useEffect(() => {
    const fetchData = async () => {
      const { slug: s } = await params;
      setSlug(s);
      const { data, error } = await supabase.from('users').select('*').eq('slug', s).single();
      if (error || !data) { console.error('Erro:', error); return; }
      setUserData(data as UserData);
      setFotosEdit((data as UserData).fotos || []);
      const qr = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_BASE_URL}/${s}`, { width:280, margin:2, color:{ dark:'#2d1b2e', light:'#ffffff' } });
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
      const hours = Math.floor((diff%86400000)/3600000);
      const minutes = Math.floor((diff%3600000)/60000);
      const seconds = Math.floor((diff%60000)/1000);
      if (months<0){months+=12;years--;}
      if (days<0){const lm=new Date(now.getFullYear(),now.getMonth()-1,0);days=lm.getDate()+days;months--;if(months<0){months=11;years--;}}
      setTimeElapsed({years,months,days,hours,minutes,seconds});
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [userData]);

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

  /* ── Auth: gerenciar fotos ── */
  const handleAuth = async () => {
    if (!authEmail.trim()) { setAuthError('Digite seu email.'); return; }
    setAuthLoading(true); setAuthError('');
    try {
      const fd = new FormData();
      fd.append('slug', slug!); fd.append('email', authEmail); fd.append('action', 'validate');
      const res = await fetch('/api/edit-photos', { method: 'POST', body: fd });
      if (res.status === 401) { setAuthError('Email incorreto. Tente novamente.'); return; }
      if (res.status === 404) { setAuthError('Página não encontrada.'); return; }
      setAuthModal(false);
      setEditMode(true);
    } catch { setAuthError('Erro de conexão.'); }
    finally { setAuthLoading(false); }
  };

  /* ── Auth: baixar e-book ── */
  const handleEbookAuth = async () => {
    if (!ebookEmail.trim()) { setEbookError('Digite seu email.'); return; }
    setEbookLoading(true); setEbookError('');
    try {
      const fd = new FormData();
      fd.append('slug', slug!);
      fd.append('email', ebookEmail);
      fd.append('action', 'validate');
      const res = await fetch('/api/edit-photos', { method: 'POST', body: fd });
      if (res.status === 401) { setEbookError('Email incorreto. Tente novamente.'); return; }
      if (res.status === 404) { setEbookError('Página não encontrada.'); return; }
      // Autenticado — dispara o download e fecha o modal
      const link = document.createElement('a');
      link.href = '/ebook.pdf';
      link.download = 'Meu-Primeiro-Ano.pdf';
      link.click();
      setEbookModal(false);
      setEbookEmail('');
    } catch { setEbookError('Erro de conexão.'); }
    finally { setEbookLoading(false); }
  };

  const handleRemoveFoto = async (url: string) => {
    if (!slug || editLoading) return;
    if (!confirm('Remover esta foto?')) return;
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append('slug', slug); fd.append('email', authEmail);
      fd.append('action', 'remove'); fd.append('fotoUrl', url);
      const res  = await fetch('/api/edit-photos', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setFotosEdit(data.fotos);
        if (userData) setUserData({ ...userData, fotos: data.fotos });
      } else { alert(data.error || 'Erro ao remover foto.'); }
    } finally { setEditLoading(false); }
  };

  const handleAddFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !slug || editLoading) return;
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append('slug', slug); fd.append('email', authEmail);
      fd.append('action', 'add'); fd.append('foto', file);
      const res  = await fetch('/api/edit-photos', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setFotosEdit(data.fotos);
        if (userData) setUserData({ ...userData, fotos: data.fotos });
      } else { alert(data.error || 'Erro ao adicionar foto.'); }
    } finally { setEditLoading(false); e.target.value = ''; }
  };

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
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:'100vh', background:t.pageBg, color:'#2d1b2e', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&family=Kalam:wght@300;400&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        @keyframes float  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-6px) rotate(-2deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .7s ease forwards; }
        .float   { animation: float 3s ease-in-out infinite; }
      `}</style>

      {userData.plano === 'sempre' && <audio id="bg-audio" loop><source src="/rugrats.mp3" type="audio/mp3"/></audio>}

      {/* ══════════════════════════════
          MODAL — Gerenciar fotos
      ══════════════════════════════ */}
      {authModal && (
        <div
          onClick={() => setAuthModal(false)}
          style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:'white', borderRadius:24, padding:'40px 32px', maxWidth:400, width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,.2)' }}
          >
            <h2 className="pf" style={{ fontSize:'1.4rem', color:'#2d1b2e', marginBottom:8 }}>Gerenciar fotos</h2>
            <p style={{ fontSize:'.88rem', color:'#a08898', marginBottom:24, lineHeight:1.5 }}>
              Digite o email usado na criação da página para entrar no modo de edição.
            </p>
            <input
              type="email"
              value={authEmail}
              onChange={e => { setAuthEmail(e.target.value); setAuthError(''); }}
              placeholder="seu@email.com"
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              style={{ width:'100%', padding:'12px 16px', borderRadius:14, border:`1.5px solid ${authError ? '#f87171' : t.border1}`, fontSize:'.97rem', fontFamily:"'Nunito',sans-serif", outline:'none', marginBottom:8, boxSizing:'border-box' } as React.CSSProperties}
            />
            {authError && <p style={{ color:'#ef4444', fontSize:'.78rem', marginBottom:8 }}>{authError}</p>}
            <button
              onClick={handleAuth}
              disabled={authLoading}
              style={{ width:'100%', padding:'13px', borderRadius:50, border:'none', background:t.gradient, color:'white', fontWeight:700, fontSize:'1rem', cursor: authLoading ? 'wait' : 'pointer', fontFamily:"'Nunito',sans-serif", marginTop:4 }}
            >
              {authLoading ? 'Verificando...' : 'Entrar no modo de edição'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          MODAL — Baixar e-book
      ══════════════════════════════ */}
      {ebookModal && (
        <div
          onClick={() => { setEbookModal(false); setEbookEmail(''); setEbookError(''); }}
          style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:'white', borderRadius:24, padding:'40px 32px', maxWidth:400, width:'100%', boxShadow:'0 24px 80px rgba(0,0,0,.2)' }}
          >
            <div style={{ fontSize:40, textAlign:'center', marginBottom:12 }}>📖</div>
            <h2 className="pf" style={{ fontSize:'1.4rem', color:'#2d1b2e', marginBottom:8, textAlign:'center' }}>
              Baixar e-book gratuito
            </h2>
            <p style={{ fontSize:'.88rem', color:'#a08898', marginBottom:24, lineHeight:1.5, textAlign:'center' }}>
              Digite o email usado na criação da página de <strong>{userData.nomeBebe}</strong> para liberar o download.
            </p>
            <input
              type="email"
              value={ebookEmail}
              onChange={e => { setEbookEmail(e.target.value); setEbookError(''); }}
              placeholder="seu@email.com"
              onKeyDown={e => e.key === 'Enter' && handleEbookAuth()}
              style={{
                width:'100%', padding:'12px 16px', borderRadius:14,
                border:`1.5px solid ${ebookError ? '#f87171' : t.border1}`,
                fontSize:'.97rem', fontFamily:"'Nunito',sans-serif",
                outline:'none', marginBottom:8, boxSizing:'border-box',
              } as React.CSSProperties}
            />
            {ebookError && (
              <p style={{ color:'#ef4444', fontSize:'.78rem', marginBottom:8 }}>{ebookError}</p>
            )}
            <button
              onClick={handleEbookAuth}
              disabled={ebookLoading}
              style={{
                width:'100%', padding:'13px', borderRadius:50, border:'none',
                background:t.gradient, color:'white', fontWeight:700, fontSize:'1rem',
                cursor: ebookLoading ? 'wait' : 'pointer',
                fontFamily:"'Nunito',sans-serif", marginTop:4,
              }}
            >
              {ebookLoading ? 'Verificando...' : `${t.ebookBtnEmoji} Baixar PDF`}
            </button>
            <p style={{ textAlign:'center', fontSize:'0.7rem', color:'#c4b5c0', margin:'12px 0 0', fontStyle:'italic' }}>
              Apenas quem criou a página pode baixar o e-book 🔒
            </p>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ position:'relative', overflow:'hidden', padding:'64px 24px 48px', textAlign:'center', background:t.heroBg, borderBottom:`1px solid ${t.border1}` }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:260, height:260, background:`radial-gradient(circle,${t.blobColor1},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, background:`radial-gradient(circle,${t.blobColor2},transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
        <div className="float" style={{ fontSize:56, marginBottom:16 }}>{userData.sexo === 'menino' ? '👦' : '👧'}</div>
        <h1 className="pf fade-up" style={{ fontSize:'clamp(2.4rem,8vw,4rem)', fontWeight:700, lineHeight:1.1, marginBottom:12 }}>{userData.nomeBebe}</h1>
        <p style={{ color:'#a08898', fontSize:'0.9rem', marginBottom:10 }}>
          Nasceu em {new Date(`${userData.dataNascimento}T12:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})} às {userData.horaNascimento}
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'4px 16px', fontSize:'0.75rem', fontWeight:700, color:t.badgeColor }}>
            {t.emoji} {userData.sexo === 'menino' ? 'Menino' : 'Menina'}
          </span>
          {userData.plano === 'sempre' && (
            <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'4px 16px', fontSize:'0.75rem', fontWeight:700, color:t.badgeColor }}>🎵 Toque para ouvir</span>
          )}
        </div>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'48px 20px 80px' }}>

        {/* ── CAROUSEL / EDIÇÃO ── */}
        {editMode ? (
          <div style={{ marginBottom:56 }}>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'.8rem', color:t.badgeColor, fontWeight:700 }}>
                ✏️ Editando galeria — clique no ✕ para remover
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:8 }}>
              {fotosEdit.map((url, i) => (
                <div key={i} style={{ position:'relative', borderRadius:12, overflow:'hidden' }}>
                  <img src={url} alt={`Foto ${i+1}`} style={{ width:'100%', height:120, objectFit:'cover', display:'block' }} />
                  <button onClick={() => handleRemoveFoto(url)} style={{ position:'absolute', top:6, right:6, background:'rgba(0,0,0,.65)', border:'none', color:'white', borderRadius:'50%', width:28, height:28, cursor:'pointer', fontSize:'.82rem', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Nunito',sans-serif" }}>✕</button>
                </div>
              ))}
              {fotosEdit.length < (userData.plano === 'sempre' ? 20 : 10) && (
                <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:120, borderRadius:12, cursor:'pointer', border:`2px dashed ${t.border1}`, background:`${t.light}40`, color:t.badgeColor, fontSize:'.8rem', fontWeight:700, gap:6 }}>
                  <span style={{ fontSize:24 }}>+</span>
                  Adicionar
                  <input type="file" accept="image/*" onChange={handleAddFoto} style={{ display:'none' }} />
                </label>
              )}
            </div>
          </div>
        ) : (
          userData.fotos.length > 0 && <GaleriaCarrossel fotos={userData.fotos} tema={t} />
        )}

        {/* Botão gerenciar fotos */}
        <div style={{ textAlign:'center', marginTop:-36, marginBottom:56 }}>
          {editMode ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <span style={{ fontSize:'.82rem', color:'#a08898', fontWeight:600 }}>
                ✏️ {fotosEdit.length}/{userData.plano === 'sempre' ? 20 : 10} fotos
                {editLoading && ' · Salvando...'}
              </span>
              <button onClick={() => setEditMode(false)} style={{ background:`linear-gradient(135deg,${t.light},${t.border1})`, border:`1px solid ${t.border1}`, color:t.badgeColor, borderRadius:50, padding:'7px 18px', fontSize:'.82rem', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>
                ✓ Sair da edição
              </button>
            </div>
          ) : (
            <button onClick={() => setAuthModal(true)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.75rem', color:'#a08898', fontFamily:"'Nunito',sans-serif", opacity:.5 }}>
              🔒 Gerenciar fotos
            </button>
          )}
        </div>

        {/* ── COUNTDOWN ── */}
        {timeElapsed && (
          <div style={{ marginBottom:56 }}>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>⏱ Tempo de vida</span>
            </div>
            <div style={{ background:'white', borderRadius:22, padding:'28px 20px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, marginBottom:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {timeUnits.slice(0,3).map(({label,value}) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div className="pf" style={{ fontSize:'2.4rem', fontWeight:700, color:t.countColor1, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:'0.75rem', color:'#a08898', marginTop:4, fontWeight:600 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:t.cardBg2, borderRadius:22, padding:'28px 20px', border:`1.5px solid ${t.border2}`, boxShadow:'0 4px 24px rgba(196,181,253,0.15)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {timeUnits.slice(3).map(({label,value}) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div className="pf" style={{ fontSize:'2.4rem', fontWeight:700, color:t.countColor2, lineHeight:1 }}>{value}</div>
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
        <CuriosidadesCard dataNascimento={userData.dataNascimento} horaNascimento={userData.horaNascimento} nomeBebe={userData.nomeBebe} t={t} />

        {/* ── EBOOK (passa callback que abre o modal de auth) ── */}
        <EbookCard t={t} nomeBebe={userData.nomeBebe} onDownload={() => setEbookModal(true)} />

        {/* ── POST-ITS ── */}
        {slug && (
          <PostitsSection slug={slug} nomeBebe={userData.nomeBebe} t={t} />
        )}

        {/* ── MENSAGEM DOS PAIS ── */}
        <div style={{ marginBottom:56 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>💌 Mensagem de {userData.nomePais}</span>
          </div>
          <div style={{ background:'white', borderRadius:22, padding:'32px 28px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, position:'relative' }}>
            <div style={{ position:'absolute', top:16, left:20, fontFamily:"'Playfair Display',serif", fontSize:'4rem', color:t.quoteColor, lineHeight:1, userSelect:'none' }}>"</div>
            <p style={{ fontSize:'1.05rem', color:'#4a3550', lineHeight:1.8, fontStyle:'italic', textAlign:'center', paddingTop:16, position:'relative' }}>{userData.mensagem}</p>
            <div style={{ position:'absolute', bottom:8, right:20, fontFamily:"'Playfair Display',serif", fontSize:'4rem', color:t.quoteColor, lineHeight:1, userSelect:'none' }}>"</div>
          </div>
        </div>

        {/* ── QR CODE ── */}
        {qrCodeUrl && (
          <div style={{ textAlign:'center' }}>
            <div style={{ marginBottom:20 }}>
              <span style={{ display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color:t.badgeColor, fontWeight:700 }}>📱 Seu QR Code exclusivo</span>
            </div>
            <div style={{ background:'white', borderRadius:22, padding:'32px', border:`1.5px solid ${t.border1}`, boxShadow:`0 4px 24px ${t.shadow}`, display:'inline-block' }}>
              <img src={qrCodeUrl} alt="QR Code" style={{ width:200, height:200, borderRadius:12, display:'block', margin:'0 auto 16px' }} />
              <p style={{ color:'#a08898', fontSize:'0.78rem', marginBottom:16 }}>Escaneie para acessar esta página</p>
              <button
                onClick={downloadQR}
                style={{ background:t.gradient, color:'white', border:'none', padding:'12px 32px', borderRadius:50, fontSize:'0.9rem', fontWeight:700, cursor:'pointer', boxShadow:`0 6px 20px ${t.shadow}`, fontFamily:"'Nunito',sans-serif", transition:'transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >Baixar QR Code {t.emoji}</button>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#2d1b2e', padding:'32px 24px', textAlign:'center' }}>
        <img src="/chupeta.png" alt="BabyTimee" style={{ width:32, height:32, objectFit:'contain', margin:'0 auto 8px', display:'block' }} />
        <p className="pf" style={{ color:t.footerName, fontWeight:700, marginBottom:4 }}>BabyTimee</p>
        <p style={{ color:'#6b5c6e', fontSize:'0.72rem' }}>Copyright © 2026 BabyTimee · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default UserPage;