'use client';

import { useRouter } from 'next/navigation';

const sections = [
  {
    num: '1', title: 'Introdução',
    content: 'Sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma.',
  },
  {
    num: '2', title: 'Informações que Coletamos',
    content: null,
    isList: true,
    items: [
      { label: 'Dados do bebê e da família:', desc: 'Nome do bebê, nome dos pais, data e hora de nascimento, mensagem personalizada e fotos.' },
      { label: 'Contato:', desc: 'Endereço de email para envio do link da página personalizada.' },
      { label: 'Pagamento:', desc: 'Processado integralmente pelo Stripe. Não armazenamos dados de cartão de crédito.' },
    ],
  },
  {
    num: '3', title: 'Como Usamos Suas Informações',
    content: null,
    isList: true,
    items: [
      { label: null, desc: 'Processar o pagamento e enviar o link da página personalizada via email.' },
      { label: null, desc: 'Criar e personalizar a página do bebê com as informações fornecidas.' },
      { label: null, desc: 'Melhorar nossos serviços e suporte ao cliente.' },
    ],
  },
  {
    num: '4', title: 'Compartilhamento de Informações',
    content: 'Não compartilhamos suas informações pessoais com terceiros, exceto conforme necessário para processar pagamentos via Stripe e conforme exigido por lei.',
  },
  {
    num: '5', title: 'Segurança',
    content: 'Implementamos medidas de segurança para proteger suas informações contra acesso, uso ou divulgação não autorizados. No entanto, nenhuma transmissão de dados pela internet é completamente segura, e não podemos garantir a segurança absoluta.',
  },
  {
    num: '6', title: 'Retenção de Dados',
    content: 'Reteremos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletadas, de acordo com o plano contratado (1 ano ou vitalício), ou conforme exigido por lei.',
  },
  {
    num: '7', title: 'Seus Direitos',
    content: null,
    isContact: true,
    prefix: 'Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos, entre em contato conosco pelo email:',
  },
  {
    num: '8', title: 'Alterações nesta Política',
    content: 'Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos isso, revisaremos a data da "última atualização" no topo desta página.',
  },
  {
    num: '9', title: 'Contato',
    content: null,
    isContact: true,
    prefix: 'Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo email:',
  },
];

const Privacy = () => {
  const router = useRouter();

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:'100vh', background:'linear-gradient(155deg,#fff5f8 0%,#f0f7ff 50%,#f5f0ff 100%)', color:'#2d1b2e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'rgba(255,245,248,0.95)', backdropFilter:'blur(14px)', borderBottom:'1px solid #fce4ef', padding:'14px 32px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => router.push('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:9 }}>
          <img src="/chupeta.png" alt="BabyTimee" style={{ width:28, height:28, objectFit:'contain' }} />
          <span className="pf" style={{ fontSize:'1.2rem', fontWeight:700, background:'linear-gradient(90deg,#60a5fa,#e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>BabyTimee</span>
        </button>
        <span style={{ color:'#c4b5c0', fontSize:'0.8rem', marginLeft:4 }}>/ Política de Privacidade</span>
      </nav>

      {/* HERO */}
      <div style={{ background:'linear-gradient(155deg,#fce4ef60,#dbeafe30)', padding:'56px 24px 44px', textAlign:'center', borderBottom:'1px solid #fce4ef', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, background:'radial-gradient(circle,rgba(249,168,201,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, background:'radial-gradient(circle,rgba(147,197,253,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
        <h1 className="pf" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:700, marginBottom:10 }}>Política de Privacidade</h1>
        <p style={{ color:'#a08898', fontSize:'0.88rem' }}>Última atualização: 10 de maio de 2026</p>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 20px 80px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sections.map((s) => (
            <div key={s.num} style={{ background:'white', borderRadius:20, padding:'24px 28px', border:'1.5px solid #fce4ef', boxShadow:'0 2px 16px rgba(232,121,160,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#fce4ef,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:700, color:'#e879a0' }}>{s.num}</div>
                <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#2d1b2e', margin:0 }}>{s.title}</h2>
              </div>

              {s.content && <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.75, margin:0 }}>{s.content}</p>}

              {s.isList && s.items && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {s.items.map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <span style={{ color:'#f9a8c9', fontSize:'1rem', flexShrink:0, marginTop:2 }}>✦</span>
                      <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.7, margin:0 }}>
                        {item.label && <strong style={{ color:'#2d1b2e' }}>{item.label} </strong>}
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {s.isContact && (
                <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.75, margin:0 }}>
                  {s.prefix}{' '}
                  <a href="mailto:contato.babytimee@gmail.com" style={{ color:'#e879a0', fontWeight:700, textDecoration:'none' }}>contato.babytimee@gmail.com</a>
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:40 }}>
          <button onClick={() => router.push('/')} style={{ background:'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)', color:'white', border:'none', padding:'13px 32px', borderRadius:50, fontSize:'0.95rem', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 6px 20px rgba(232,121,160,0.35)' }}>
            ← Voltar ao início
          </button>
        </div>
      </div>

      <footer style={{ background:'#2d1b2e', padding:'28px 24px', textAlign:'center' }}>
        <img src="/chupeta.png" alt="BabyTimee" style={{ width:28, height:28, objectFit:'contain', margin:'0 auto 8px', display:'block' }} />
        <p className="pf" style={{ fontWeight:700, marginBottom:4, background:'linear-gradient(90deg,#60a5fa,#e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', display:'inline-block' }}>BabyTimee</p>
        <p style={{ color:'#6b5c6e', fontSize:'0.72rem', marginTop:4 }}>Copyright © 2026 BabyTimee · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Privacy;