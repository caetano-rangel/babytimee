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

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:'#f7fbff', color:'#2d1b2e', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        .btn-blue:hover  { transform:translateY(-3px); box-shadow:0 14px 36px rgba(96,165,250,0.55) !important; }
        .btn-pink:hover  { transform:translateY(-3px); box-shadow:0 14px 36px rgba(232,121,160,0.55) !important; }
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
              <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, fontSize:'1.05rem', padding:'15px 32px' }}>
                É um menino 💙
              </button>
              <button onClick={go('/form')} className="btn-pink" style={{
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

      {/* ── PRICING ── */}
      <section style={{ padding:'80px 24px', background:'linear-gradient(155deg,#f0f7ff,#fce4ef30)' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:'linear-gradient(135deg,#dbeafe,#fce4ef)', borderRadius:50, padding:'5px 18px', fontSize:'0.82rem', color:'#3b82f6', fontWeight:700, marginBottom:14 }}>💰 Investimento único</span>
            <h2 className="pf" style={{ fontSize:'2rem', color:'#2d1b2e', fontWeight:700 }}>Escolha seu Plano</h2>
            <p style={{ color:'#6b5c6e', marginTop:8, fontSize:'0.95rem' }}>Memória para seus primeiros anos</p>
          </motion.div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:24, justifyContent:'center' }}>
            {/* Básico */}
            <motion.div variants={fadeUp(0)} initial="hidden" whileInView="show" viewport={{ once:true }}
              whileHover={{ y:-6, transition:{ duration:0.3 } }}
              style={{ flex:'1 1 280px', maxWidth:340 }}>
              <div style={{ background:'white', borderRadius:22, padding:'28px 22px', border:'1.5px solid #dbeafe', boxShadow:'0 4px 24px rgba(191,219,254,0.15)' }}>
                <p style={{ fontSize:'0.8rem', color:'#93c5fd', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Básico</p>
                <p className="pf" style={{ fontSize:'2.8rem', fontWeight:700, color:'#2d1b2e' }}>R$29</p>
                <div style={{ height:2, borderRadius:2, margin:'14px 0 20px', background:'linear-gradient(90deg,#dbeafe,#bfdbfe)' }} />
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:6, color:'#374151' }}><span style={{ color:'#4ade80' }}>✓</span> 1 ano de acesso</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:6, color:'#374151' }}><span style={{ color:'#4ade80' }}>✓</span> Até 10 fotos</li>
                  <li style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:6, color:'#9ca3af' }}><span style={{ color:'#f87171' }}>✕</span> Sem música</li>
                </ul>
                <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, width:'100%', marginTop:24 }}>Começar agora</button>
              </div>
            </motion.div>

            {/* Premium */}
            <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once:true }}
              whileHover={{ y:-6, transition:{ duration:0.3 } }}
              style={{ flex:'1 1 280px', maxWidth:340, position:'relative' }}>
              <div style={{ background:'white', borderRadius:22, padding:'42px 22px 28px', position:'relative', boxShadow:'0 8px 40px rgba(147,197,253,0.2)' }}>
                {/* gradient border */}
                <div style={{ position:'absolute', inset:0, borderRadius:22, padding:2, background:'linear-gradient(135deg,#93c5fd,#f9a8c9)', WebkitMask:'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite:'xor', maskComposite:'exclude', pointerEvents:'none', opacity:0.85 }} />
                <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#93c5fd,#f9a8c9)', borderRadius:50, padding:'4px 18px', whiteSpace:'nowrap', fontSize:'0.76rem', fontWeight:700, color:'white' }}>⭐ Mais escolhido</div>
                <p style={{ fontSize:'0.8rem', color:'#93c5fd', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Premium</p>
                <p className="pf" style={{ fontSize:'2.8rem', fontWeight:700, color:'#2d1b2e' }}>R$59</p>
                <div style={{ height:2, borderRadius:2, margin:'14px 0 20px', background:'linear-gradient(90deg,#93c5fd,#f9a8c9)' }} />
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
                  {['3 anos de acesso','Até 20 fotos','Com música 🎵'].map(f => (
                    <li key={f} style={{ fontSize:'0.93rem', display:'flex', alignItems:'center', gap:6, color:'#374151' }}>
                      <span style={{ color:'#4ade80' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, width:'100%', marginTop:24, background:'linear-gradient(135deg,#93c5fd,#f9a8c9)', boxShadow:'0 8px 24px rgba(147,197,253,0.35)' }}>
                  Quero o Premium 💙
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
            <button onClick={go('/form')} className="btn-blue" style={{ ...btnStyle, fontSize:'1rem', padding:'14px 28px' }}>
              É um menino 💙
            </button>
            <button onClick={go('/form')} className="btn-pink" style={{
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