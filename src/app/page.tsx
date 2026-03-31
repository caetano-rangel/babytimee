"use client"
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});

/* ── QR pattern ── */
const QR_PATTERN = [
  1,1,1,1,1,1,1,0, 1,0,0,0,0,0,1,0,
  1,0,1,1,1,0,1,0, 1,0,1,0,1,0,1,0,
  1,0,1,1,1,0,1,0, 1,0,0,0,0,0,1,0,
  1,1,1,1,1,1,1,0, 0,1,0,1,0,1,0,1,
];

function PhoneMock() {
  return (
    <div style={{
      background: '#1a0f1e', borderRadius: 36, padding: '10px 7px', width: 200,
      boxShadow: '0 32px 72px rgba(45,27,46,0.35), 0 0 0 1px #3d2545',
    }}>
      <div style={{
        background: 'linear-gradient(160deg,#fff5f8,#f0f7ff,#f5f0ff)',
        borderRadius: 28, padding: 14, minHeight: 340,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 52, height: 52,
          background: 'linear-gradient(135deg,#fce4ef,#bfdbfe)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 26,
          boxShadow: '0 6px 18px rgba(191,219,254,0.5)',
        }}>👶</div>
        <div style={{ fontFamily:"'Playfair Display',serif", color:'#6b7fa3', fontWeight:700, fontSize:'1rem' }}>Sofia ✨</div>
        <div style={{ fontSize:'0.64rem', color:'#6b5c6e', textAlign:'center' }}>Nasceu em 12/03/2024</div>
        <div style={{
          background: 'linear-gradient(135deg,#f0f7ff,#dbeafe)',
          borderRadius: 14, padding:'8px 14px', textAlign:'center',
          border:'1px solid #bfdbfe', width:'100%',
        }}>
          <div style={{ fontSize:'0.6rem', color:'#6b7fa3' }}>Ela tem</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', color:'#3b82f6', fontWeight:700 }}>1a 2m 18d</div>
          <div style={{ fontSize:'0.6rem', color:'#6b7fa3' }}>de vida 💗</div>
        </div>
        <div style={{ background:'#fdf4ff', borderRadius:10, padding:'7px 10px', width:'100%', fontSize:'0.62rem', color:'#7c6b8a', textAlign:'center', fontStyle:'italic' }}>
          "Você é nossa maior alegria!"
        </div>
        <div style={{ background:'white', borderRadius:10, padding:6, border:'1px solid #e0e7ff' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:1.5 }}>
            {QR_PATTERN.map((v,i) => (
              <div key={i} style={{ width:5, height:5, borderRadius:1, background: v ? '#2d1b2e' : 'transparent' }} />
            ))}
          </div>
          <div style={{ fontSize:'0.58rem', color:'#a08898', marginTop:2, textAlign:'center' }}>QR Code exclusivo</div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ emoji, num, title, desc, delay }: {
  emoji: string; num: string; title: string; desc: string; delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp(delay)} initial="hidden" whileInView="show" viewport={{ once: true, margin:'-60px' }}
      whileHover={{ y:-6, transition:{ duration:0.3 } }}
      style={{
        background:'white', borderRadius:22, padding:'28px 22px', textAlign:'center',
        border:'1.5px solid #e0eeff',
        boxShadow:'0 4px 24px rgba(191,219,254,0.15)',
      }}
    >
      <div style={{ fontSize:40, marginBottom:10 }}>{emoji}</div>
      <div style={{
        width:26, height:26,
        background:'linear-gradient(135deg,#dbeafe,#fce4ef)',
        borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 10px', fontSize:'0.78rem', fontWeight:700, color:'#3b82f6',
      }}>{num}</div>
      <h3 style={{ fontSize:'0.95rem', fontWeight:700, color:'#2d1b2e', marginBottom:6 }}>{title}</h3>
      <p style={{ fontSize:'0.84rem', color:'#6b5c6e', lineHeight:1.6 }}>{desc}</p>
    </motion.div>
  );
}

function TestiCard({ quote, name, role, delay }: {
  quote: string; name: string; role: string; delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp(delay)} initial="hidden" whileInView="show" viewport={{ once:true, margin:'-60px' }}
      whileHover={{ y:-6, transition:{ duration:0.3 } }}
      style={{
        background:'white', borderRadius:22, padding:'28px 22px',
        border:'1.5px solid #e0eeff',
        boxShadow:'0 4px 24px rgba(191,219,254,0.12)',
        flex:'1 1 230px', maxWidth:300,
      }}
    >
      <div style={{ color:'#93c5fd', fontSize:'0.9rem', marginBottom:12 }}>★★★★★</div>
      <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.65, fontStyle:'italic', marginBottom:18 }}>{quote}</p>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{
          width:36, height:36, flexShrink:0,
          background:'linear-gradient(135deg,#dbeafe,#bfdbfe)',
          borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17,
        }}>👩</div>
        <div>
          <div style={{ fontWeight:700, color:'#2d1b2e', fontSize:'0.88rem' }}>{name}</div>
          <div style={{ color:'#a08898', fontSize:'0.76rem' }}>{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Capa do E-book (estática) ── */
function EbookCover({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const w = size === 'lg' ? 120 : 88;
  const h = size === 'lg' ? 160 : 118;
  const emoji = size === 'lg' ? '2rem' : '1.5rem';
  const title = size === 'lg' ? '0.6rem' : '0.48rem';
  const sub   = size === 'lg' ? '0.46rem' : '0.36rem';

  return (
    <div style={{
      width: w, height: h,
      background: 'linear-gradient(155deg,#f9a8c9,#e879a0,#d1598c,#a855a0)',
      borderRadius: '6px 12px 12px 6px',
      boxShadow: `4px 8px 28px rgba(200,80,130,0.45), inset -3px 0 8px rgba(0,0,0,0.18)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 6, position: 'relative', flexShrink: 0,
    }}>
      {/* Lombada */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:7, background:'rgba(0,0,0,0.22)', borderRadius:'6px 0 0 6px' }} />
      {/* Brilho */}
      <div style={{ position:'absolute', top:8, left:14, right:8, height:1, background:'rgba(255,255,255,0.3)', borderRadius:99 }} />
      <span style={{ fontSize: emoji, filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}>🍼</span>
      <div style={{ textAlign:'center', padding:'0 10px' }}>
        <p style={{ fontFamily:"'Playfair Display',serif", color:'white', fontSize: title, fontWeight:700, lineHeight:1.35, margin:0, textShadow:'0 1px 3px rgba(0,0,0,0.3)' }}>
          Meu Primeiro Ano
        </p>
        <div style={{ width:28, height:1, background:'rgba(255,255,255,0.45)', margin:'4px auto' }} />
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize: sub, margin:0, letterSpacing:'0.06em', fontFamily:"'Nunito',sans-serif" }}>
          GUIA PARA MÃES
        </p>
      </div>
    </div>
  );
}

const Home: React.FC = () => {
  const router = useRouter();
  const go = (path: string) => () => router.push(path);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] });
  const heroY = useTransform(scrollYProgress, [0,1], ['0%','20%']);

  const btnStyle: React.CSSProperties = {
    display:'inline-block',
    background:'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)',
    color:'white', border:'none', padding:'14px 36px', borderRadius:50,
    fontSize:'1rem', fontWeight:700, cursor:'pointer',
    boxShadow:'0 8px 24px rgba(96,165,250,0.4)',
    fontFamily:"'Nunito',sans-serif", transition:'transform 0.3s, box-shadow 0.3s',
  };

  // Badge "Mais escolhido": cores do próprio card metálico (escuro fosco com borda brilhante)
  const premiumBadgeBg = 'linear-gradient(135deg,#3d1060,#6b1a4a,#4a0a2e)';
  const premiumBadgeBorder = '1px solid rgba(232,121,160,0.45)';
  // Botão Premium: violeta-roxo do site, harmonizando com as bordas metálicas do card
  const premiumBtnGradient = 'linear-gradient(135deg,#a855f7,#7c3aed,#6d28d9)';
  const premiumBtnShadow = '0 8px 28px rgba(124,58,237,0.5)';

  const ebookCapitulos = [
    { emoji:'🛍️', titulo:'O Enxoval Inteligente',          sub:'Só o que é essencial de verdade' },
    { emoji:'🌙', titulo:'Sono & Segurança',                sub:'Rotinas e ambiente seguro para dormir' },
    { emoji:'🤱', titulo:'Amamentação & Nutrição',          sub:'Primeiros passos e dificuldades comuns' },
    { emoji:'🏠', titulo:'Adaptação & Rede de Apoio',       sub:'Rotina, ritual da noite e suporte' },
    { emoji:'💉', titulo:'Vacinas & Cuidados Médicos',      sub:'Calendário e sinais de alerta' },
  ];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:'#f7fbff', color:'#2d1b2e', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        .btn-blue:hover  { transform:translateY(-3px); box-shadow:0 14px 36px rgba(96,165,250,0.55) !important; }
        .btn-pink:hover  { transform:translateY(-3px); box-shadow:0 14px 36px rgba(232,121,160,0.55) !important; }
        .btn-gold:hover  { transform:translateY(-3px); box-shadow:0 14px 36px rgba(200,146,42,0.65) !important; }
        .eb-chap:hover   { transform:translateX(4px); }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        background:'rgba(247,251,255,0.95)', backdropFilter:'blur(14px)',
        borderBottom:'1px solid #dbeafe',
        padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <img src="/chupeta.png" alt="BabyTimee" style={{ width:30, height:30, objectFit:'contain' }} />
          <span className="pf" style={{ fontSize:'1.35rem', fontWeight:700, background:'linear-gradient(90deg,#60a5fa,#e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>BabyTimee</span>
        </div>
        <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, padding:'10px 22px', fontSize:'0.88rem' }}>
          Criar meu site
        </button>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        background:'linear-gradient(155deg,#f0f7ff 0%,#e0eeff 30%,#fce4ef 70%,#fff5f8 100%)',
        padding:'80px 24px 64px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:340, height:340, background:'radial-gradient(circle,rgba(191,219,254,0.35),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:260, height:260, background:'radial-gradient(circle,rgba(249,168,201,0.25),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', left:'50%', width:200, height:200, background:'radial-gradient(circle,rgba(196,181,253,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none', transform:'translate(-50%,-50%)' }} />

        <div style={{ maxWidth:980, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', gap:48, justifyContent:'center', position:'relative', zIndex:1 }}>

          <motion.div variants={fadeLeft(0)} initial="hidden" animate="show" style={{ flex:'1 1 320px', maxWidth:500 }}>
            <span style={{
              display:'inline-block',
              background:'linear-gradient(135deg,#dbeafe,#fce4ef)',
              borderRadius:50, padding:'5px 18px',
              fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:18,
            }}>✨ Para meninos e meninas</span>

            <h1 className="pf" style={{ fontSize:'clamp(2rem,5vw,3.1rem)', fontWeight:700, lineHeight:1.22, marginBottom:18 }}>
              Crie Memórias{' '}
              <em style={{ color:'#e879a0', fontStyle:'italic' }}>Inesquecíveis</em>
              {' '}do seu Bebê
            </h1>

            <p style={{ fontSize:'1.05rem', color:'#6b5c6e', lineHeight:1.75, marginBottom:32 }}>
              Transforme os primeiros momentos em uma página personalizada com fotos, contador de vida e um{' '}
              <strong style={{ color:'#3b82f6' }}>QR Code</strong> para presentear sua família.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:12 }}>
              <button onClick={go('/form?sexo=menino')} className="btn-blue" style={{ ...btnStyle, fontSize:'1.05rem', padding:'15px 32px' }}>
                É um menino 💙
              </button>
              <button onClick={go('/form?sexo=menina')} className="btn-pink" style={{
                ...btnStyle,
                background:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
                boxShadow:'0 8px 24px rgba(232,121,160,0.4)',
                fontSize:'1.05rem', padding:'15px 32px',
              }}>
                É uma menina 💗
              </button>
            </div>
            <p style={{ fontSize:'0.82rem', color:'#a08898' }}>Pronto em menos de 5 minutos · Sem complicação</p>
          </motion.div>

          <motion.div variants={fadeRight(0.15)} initial="hidden" animate="show" style={{ flexShrink:0 }}>
            <motion.div style={{ y: heroY }}>
              <PhoneMock />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'80px 24px', background:'#f7fbff' }}>
        <div style={{ maxWidth:880, margin:'0 auto' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>🪄 Simples assim</span>
            <h2 className="pf" style={{ fontSize:'2rem', color:'#2d1b2e', fontWeight:700 }}>Como Funciona?</h2>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:18 }}>
            <StepCard emoji="📋" num="1" title="Preencha os dados"  desc="Nome, data, sexo do bebê e as fotos mais lindas."         delay={0}   />
            <StepCard emoji="💳" num="2" title="Faça o pagamento"   desc="Seguro e instantâneo via cartão ou Pix."                   delay={0.1} />
            <StepCard emoji="🎁" num="3" title="Receba o QR Code"   desc="Um QR Code exclusivo para acessar a página do bebê."      delay={0.2} />
            <StepCard emoji="🥰" num="4" title="Faça uma surpresa!" desc="Imprima e presenteie sua família com esse momento único."  delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section style={{ padding:'80px 24px', background:'white' }}>
        <div style={{ maxWidth:880, margin:'0 auto' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>✨ O que está incluído</span>
            <h2 className="pf" style={{ fontSize:'2rem', color:'#2d1b2e', fontWeight:700 }}>Tudo que a página do seu bebê tem</h2>
            <p style={{ color:'#6b5c6e', marginTop:8, fontSize:'0.95rem' }}>Uma experiência completa e emocionante</p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {[
              { emoji:'📸', title:'Galeria de fotos', desc:'Carrossel com as fotos mais lindas do seu bebê, com swipe e visualização em tela cheia.', color:'#dbeafe', badge:'#3b82f6' },
              { emoji:'⏱️', title:'Contador de vida', desc:'Contador em tempo real mostrando anos, meses, dias, horas, minutos e segundos de vida.', color:'#fce4ef', badge:'#e879a0' },
              { emoji:'✨', title:'Signo do bebê', desc:'Signo calculado automaticamente com símbolo, elemento, pedra e descrição personalizada.', color:'#ede9fe', badge:'#a78bfa' },
              { emoji:'🧸', title:'Curiosidades', desc:'Dados divertidos como batimentos cardíacos, fraldas trocadas e voltas ao redor do Sol.', color:'#dcfce7', badge:'#22c55e' },
              { emoji:'💌', title:'Mensagem especial', desc:'Uma mensagem dos pais eternizada na página com um layout elegante e emocional.', color:'#fef9c3', badge:'#ca8a04' },
              { emoji:'📱', title:'QR Code exclusivo', desc:'QR Code único para acessar e compartilhar a página com toda a família.', color:'#dbeafe', badge:'#3b82f6' },
              { emoji:'🎵', title:'Música de fundo', desc:'Uma trilha sonora especial que toca ao abrir a página. Disponível no plano Premium.', color:'#fce4ef', badge:'#e879a0' },
              { emoji:'💙💗', title:'Tema por sexo', desc:'A página muda de cor automaticamente — azul para meninos e rosa para meninas.', color:'#ede9fe', badge:'#a78bfa' },
            ].map(({ emoji, title, desc, color, badge }, i) => (
              <motion.div key={i} variants={fadeUp(i * 0.05)} initial="hidden" whileInView="show" viewport={{ once:true }}
                whileHover={{ y:-4, transition:{ duration:0.2 } }}
                style={{ background:'white', borderRadius:20, padding:'24px 20px', border:'1.5px solid #f0eeff', boxShadow:'0 4px 20px rgba(167,139,250,0.08)', display:'flex', flexDirection:'column', gap:12 }}
              >
                <div style={{ width:48, height:48, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>{emoji}</div>
                <div>
                  <p style={{ fontWeight:700, color:'#2d1b2e', fontSize:'0.95rem', marginBottom:6 }}>{title}</p>
                  <p style={{ color:'#6b5c6e', fontSize:'0.85rem', lineHeight:1.6 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO EBOOK ── */}
      <section style={{
        padding:'88px 24px',
        background:'linear-gradient(155deg,#f0f7ff 0%,#e8eeff 20%,#ede8f8 50%,#fce4ef 80%,#fff5f8 100%)',
        position:'relative', overflow:'hidden',
      }}>
        <style>{`
          .ebook-top-inner { display:flex; flex-wrap:wrap; align-items:center; gap:36px; position:relative; }
          .ebook-cover-wrap { display:flex; justify-content:center; width:auto; }
          .ebook-info { flex:1 1 260px; }
          .ebook-body { padding:32px 40px 36px; }
          .ebook-cta-row { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; padding:20px 24px; background:linear-gradient(135deg,#f0f7ff,#fce4ef30); border-radius:18px; border:1.5px solid #e0eeff; }
          .ebook-cta-btn { white-space:nowrap; }
          .ebook-top { padding:40px 40px 32px; position:relative; overflow:hidden; background:linear-gradient(135deg,#f0f7ff,#e8eeff 50%,#fff5f8); }
          @media (max-width: 600px) {
            .ebook-top { padding:28px 20px 24px; }
            .ebook-top-inner { flex-direction:column; align-items:center; gap:20px; text-align:center; }
            .ebook-cover-wrap { width:100%; }
            .ebook-info { flex:unset; width:100%; text-align:center; }
            .ebook-info .eb-tags { justify-content:center; }
            .ebook-body { padding:24px 20px 28px; }
            .ebook-cta-row { flex-direction:column; align-items:stretch; text-align:center; padding:18px 16px; }
            .ebook-cta-btn { width:100%; text-align:center; }
          }
        `}</style>

        {/* Blobs decorativos — azul e rosa suaves como no hero */}
        <div style={{ position:'absolute', top:-60, right:-60, width:320, height:320, background:'radial-gradient(circle,rgba(191,219,254,0.28),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-40, width:260, height:260, background:'radial-gradient(circle,rgba(249,168,201,0.22),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        <div style={{ maxWidth:900, margin:'0 auto', position:'relative', zIndex:1 }}>

          {/* Header da seção */}
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>
              📖 Bônus exclusivo Premium
            </span>
            <h2 className="pf" style={{ fontSize:'clamp(1.6rem,4vw,2.3rem)', color:'#2d1b2e', fontWeight:700, lineHeight:1.2, marginBottom:12 }}>
              E-book gratuito incluso no{' '}
              <em style={{ color:'#e879a0' }}>plano Premium</em>
            </h2>
            <p style={{ color:'#6b5c6e', fontSize:'0.97rem', lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
              Além da página do bebê, você recebe um guia completo para atravessar o primeiro ano com mais confiança e leveza.
            </p>
          </motion.div>

          {/* Card principal do ebook */}
          <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <div style={{ background:'white', borderRadius:28, border:'1.5px solid #ddd8f0', boxShadow:'0 12px 48px rgba(120,100,200,0.1)', overflow:'hidden' }}>

              {/* Topo colorido */}
              <div className="ebook-top">
                <div style={{ position:'absolute', top:-30, right:-30, width:180, height:180, background:'radial-gradient(circle,rgba(191,219,254,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

                <div className="ebook-top-inner">

                  {/* Capa do livro */}
                  <div className="ebook-cover-wrap">
                    <EbookCover size="lg" />
                  </div>

                  {/* Info */}
                  <div className="ebook-info">
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'4px 14px', marginBottom:14 }}>
                      <span style={{ fontSize:'0.72rem', color:'#3b82f6', fontWeight:700 }}>📖 E-book gratuito · 10 capítulos</span>
                    </div>
                    <h3 className="pf" style={{ fontSize:'1.7rem', color:'#2d1b2e', lineHeight:1.2, margin:'0 0 10px' }}>
                      Meu Primeiro Ano
                      <br />
                      <em style={{ color:'#e879a0', fontSize:'1.3rem' }}>— Guia para Mães de Primeira Viagem</em>
                    </h3>
                    <p style={{ fontSize:'0.92rem', color:'#6b5c6e', lineHeight:1.65, margin:'0 0 20px' }}>
                      Do enxoval às primeiras vacinas, do sono à amamentação — tudo o que você precisa saber nos primeiros 12 meses, com muito carinho.
                    </p>
                    {/* Tags */}
                    <div className="eb-tags" style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {['🛍️ Enxoval', '🌙 Sono', '🤱 Amamentação', '💉 Vacinas', '❤️ Autocuidado'].map(tag => (
                        <span key={tag} style={{ background:'linear-gradient(135deg,#dbeafe60,#fce4ef60)', border:'1px solid #e0eeff', borderRadius:50, padding:'4px 12px', fontSize:'0.75rem', color:'#3b82f6', fontWeight:600 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capítulos */}
              <div className="ebook-body">
                <p style={{ fontSize:'0.72rem', color:'#a08898', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 16px' }}>
                  O que você vai encontrar
                </p>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:10, marginBottom:32 }}>
                  {ebookCapitulos.map((cap, i) => (
                    <div key={i} className="eb-chap" style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'13px 16px', borderRadius:14,
                      background: i % 2 === 0
                        ? 'linear-gradient(135deg,#dbeafe40,#fce4ef20)'
                        : 'linear-gradient(135deg,#fce4ef20,#dbeafe40)',
                      border:'1px solid #e0eeff',
                      transition:'transform 0.2s',
                    }}>
                      <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{cap.emoji}</span>
                      <div>
                        <p style={{ fontSize:'0.88rem', fontWeight:700, color:'#2d1b2e', margin:0, lineHeight:1.25 }}>{cap.titulo}</p>
                        <p style={{ fontSize:'0.73rem', color:'#a08898', margin:0, marginTop:2 }}>{cap.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA inferior */}
                <div className="ebook-cta-row">
                  <div>
                    <p style={{ fontWeight:700, color:'#2d1b2e', fontSize:'1rem', margin:'0 0 3px' }}>
                      Incluso no plano Premium 💗
                    </p>
                    <p style={{ fontSize:'0.82rem', color:'#a08898', margin:0 }}>
                      PDF enviado automaticamente após a compra · sem cadastro extra
                    </p>
                  </div>
                  <button onClick={go('/form?sexo=menina')} className="btn-pink ebook-cta-btn" style={{
                    ...btnStyle,
                    background:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
                    boxShadow:'0 8px 24px rgba(232,121,160,0.4)',
                    padding:'13px 28px', fontSize:'0.95rem',
                  }}>
                    Quero o Premium 💗
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding:'80px 24px', background:'linear-gradient(155deg,#f0f7ff,#fce4ef30)' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>💰 Investimento único</span>
            <h2 className="pf" style={{ fontSize:'2rem', color:'#2d1b2e', fontWeight:700 }}>Escolha seu Plano</h2>
            <p style={{ color:'#6b5c6e', marginTop:8, fontSize:'0.95rem' }}>Memória para seus primeiros anos</p>
          </motion.div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:24, justifyContent:'center', alignItems:'stretch' }}>

            {/* Básico */}
            <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }}
              whileHover={{ y:-6, transition:{ duration:0.3 } }}
              style={{ flex:'1 1 280px', maxWidth:340, paddingTop:16 }}>
              <div style={{ background:'white', borderRadius:22, padding:'28px 22px', border:'1.5px solid #dbeafe', boxShadow:'0 4px 24px rgba(191,219,254,0.15)', height:'100%', boxSizing:'border-box', display:'flex', flexDirection:'column' }}>
                <p style={{ fontSize:'0.8rem', color:'#93c5fd', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Básico</p>
                <p className="pf" style={{ fontSize:'2.8rem', fontWeight:700, color:'#2d1b2e' }}>R$29</p>
                <div style={{ height:2, borderRadius:2, margin:'14px 0 20px', background:'linear-gradient(90deg,#dbeafe,#bfdbfe)' }} />
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, padding:0, flex:1 }}>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#374151' }}><span style={{ color:'#4ade80' }}>✓</span> 1 ano de acesso</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#374151' }}><span style={{ color:'#4ade80' }}>✓</span> Até 10 fotos</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#374151' }}><span style={{ color:'#4ade80' }}>✓</span> Contador de vida</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#9ca3af' }}><span style={{ color:'#f87171' }}>✕</span> Sem música de fundo</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#9ca3af' }}><span style={{ color:'#f87171' }}>✕</span> Sem Signo</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#9ca3af' }}><span style={{ color:'#f87171' }}>✕</span> Sem Curiosidades</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'#9ca3af' }}><span style={{ color:'#f87171' }}>✕</span> Sem e-book</li>
                </ul>
                <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, width:'100%', marginTop:24 }}>Começar agora</button>
              </div>
            </motion.div>

            {/* Premium */}
            <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once:true }}
              whileHover={{ y:-6, transition:{ duration:0.3 } }}
              style={{ flex:'1 1 280px', maxWidth:340, position:'relative', paddingTop:16 }}>
              <div style={{
                position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                background: premiumBadgeBg,
                border: premiumBadgeBorder,
                borderRadius:50, padding:'5px 20px', whiteSpace:'nowrap',
                fontSize:'0.76rem', fontWeight:700,
                color:'rgba(255,255,255,0.9)',
                boxShadow:'0 4px 16px rgba(107,26,74,0.6)',
                zIndex:2,
              }}>⭐ Mais escolhido</div>

              <div style={{
                borderRadius:22, padding:'42px 22px 28px', position:'relative',
                background:'linear-gradient(145deg,#4a0a2e 0%,#6b1a4a 20%,#3d1060 45%,#1a0a3e 70%,#0f0a2e 100%)',
                boxShadow:'0 20px 60px rgba(219,39,119,0.35), 0 8px 32px rgba(139,92,246,0.25), 0 0 0 1px rgba(255,255,255,0.08) inset',
                overflow:'hidden', height:'100%', boxSizing:'border-box', display:'flex', flexDirection:'column',
              }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:80, background:'linear-gradient(180deg,rgba(255,180,200,0.12) 0%,rgba(255,150,180,0.04) 60%,transparent 100%)', borderRadius:'22px 22px 0 0', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:0, left:0, bottom:0, width:2, background:'linear-gradient(180deg,rgba(255,100,160,0.9),rgba(200,60,120,0.5),rgba(139,92,246,0.2),transparent)', borderRadius:'22px 0 0 22px', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:0, right:0, bottom:0, width:2, background:'linear-gradient(180deg,rgba(232,121,160,0.4),rgba(139,92,246,0.5),rgba(96,165,250,0.3))', borderRadius:'0 22px 22px 0', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:-30, left:-30, width:200, height:200, background:'radial-gradient(ellipse,rgba(255,150,180,0.08),transparent 65%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:-40, right:-40, width:180, height:180, background:'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)', pointerEvents:'none' }} />

                <p style={{ fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6, background:'linear-gradient(135deg,#e879a0,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Premium</p>
                <p className="pf" style={{ fontSize:'2.8rem', fontWeight:700, color:'white', marginBottom:4 }}>R$59</p>
                <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', marginBottom:16 }}>pagamento único · 3 anos online</p>
                <div style={{ height:1, borderRadius:2, margin:'0 0 20px', background:'linear-gradient(90deg,rgba(232,121,160,0.6),rgba(168,85,247,0.6),rgba(96,165,250,0.4))' }} />

                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, padding:0, flex:1 }}>
                  {[
                    '3 anos de acesso',
                    'Até 30 fotos (Galeria Full)',
                    'Música de fundo',
                    'Signo e descrição',
                    'Curiosidades divertidas',
                    'QR Code de alta resolução',
                  ].map(f => (
                    <li key={f} style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.85)' }}>
                      <span style={{ color:'#4ade80', fontWeight:700 }}>✓</span> {f}
                    </li>
                  ))}
                  {/* Item de destaque: ebook */}
                  <li style={{ display:'flex', alignItems:'center', gap:8, marginTop:4, padding:'10px 12px', borderRadius:12, background:'rgba(232,121,160,0.15)', border:'1px solid rgba(232,121,160,0.3)' }}>
                    <span style={{ fontSize:'1rem', flexShrink:0 }}>📖</span>
                    <div>
                      <p style={{ fontSize:'0.88rem', fontWeight:700, color:'white', margin:0, lineHeight:1.2 }}>E-book gratuito incluso</p>
                      <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.55)', margin:0, marginTop:2 }}>Guia para Mães de Primeira Viagem</p>
                    </div>
                  </li>
                </ul>

                {/* Botão Premium — violeta-roxo harmonizando com as bordas metálicas do card */}
                <button
                  onClick={go('/form?sexo=menina')}
                  className="btn-gold"
                  style={{
                    ...btnStyle,
                    width:'100%', marginTop:24,
                    background: premiumBtnGradient,
                    color:'white',
                    boxShadow: premiumBtnShadow,
                    border:'none', position:'relative', overflow:'hidden',
                  }}
                >
                  <span style={{ position:'relative', zIndex:1 }}>✨ Quero o Premium</span>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 50%)', pointerEvents:'none' }} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'80px 24px', background:'#f7fbff' }}>
        <div style={{ maxWidth:880, margin:'0 auto' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>💬 Depoimentos</span>
            <h2 className="pf" style={{ fontSize:'2rem', color:'#2d1b2e', fontWeight:700 }}>O que as famílias dizem</h2>
            <p style={{ color:'#6b5c6e', marginTop:8, fontSize:'0.95rem' }}>Mais de 500 famílias já criaram suas memórias</p>
          </motion.div>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:18 }}>
            <TestiCard quote='"Toda a família se emocionou ao escanear o QR code. Presente perfeito!"' name="Ana Clara"    role="Mãe do Miguel 💙" delay={0}   />
            <TestiCard quote='"Simples, lindo e emocionante. Fiz para minha filha recém-nascida!"'    name="Fernanda Lima" role="Mãe da Sofia 💗"  delay={0.1} />
            <TestiCard quote='"Em menos de 5 minutos criei algo para guardar para sempre. Amei!"'     name="Juliana Matos" role="Mãe do Davi 💙"   delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:'88px 24px', background:'linear-gradient(135deg,#f0f7ff,#dbeafe,#fce4ef)', textAlign:'center' }}>
        <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ maxWidth:520, margin:'0 auto' }}>
          <div style={{ fontSize:52, marginBottom:18 }}>🎁</div>
          <h2 className="pf" style={{ fontSize:'1.9rem', fontWeight:700, color:'#2d1b2e', marginBottom:14 }}>
            Surpreenda sua família hoje
          </h2>
          <p style={{ fontSize:'1rem', color:'#6b5c6e', lineHeight:1.7, marginBottom:30 }}>
            Uma página única com as memórias do seu bebê. Pronto em menos de 5 minutos!
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <button onClick={go('/form?sexo=menino')} className="btn-blue" style={{ ...btnStyle, fontSize:'1rem', padding:'14px 28px' }}>
              É um menino 💙
            </button>
            <button onClick={go('/form?sexo=menina')} className="btn-pink" style={{
              ...btnStyle,
              background:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
              boxShadow:'0 8px 24px rgba(232,121,160,0.4)',
              fontSize:'1rem', padding:'14px 28px',
            }}>
              É uma menina 💗
            </button>
          </div>
          <p style={{ marginTop:14, fontSize:'0.8rem', color:'#a08898' }}>Pagamento seguro · Suporte em português</p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#2d1b2e', padding:'44px 24px', textAlign:'center' }}>
        <div style={{ fontSize:30, marginBottom:10 }}>🍼</div>
        <div className="pf" style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:8, background:'linear-gradient(90deg,#60a5fa,#e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'inline-block' }}>BabyTimee</div>
        <p style={{ color:'#a08898', fontSize:'0.88rem', marginBottom:20 }}>Surpreenda sua família com esse presente incrível!</p>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:18 }}>
          {[['Termos de uso','/terms'],['Termos de privacidade','/privacy']].map(([label,path]) => (
            <button key={path} onClick={go(path)}
              style={{ background:'none', border:'none', color:'#a08898', fontSize:'0.83rem', cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color='#a08898')}
            >{label}</button>
          ))}
        </div>
        <p style={{ color:'#6b5c6e', fontSize:'0.75rem' }}>Copyright © 2026 BabyTimee · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Home;