'use client';

import { useRouter } from 'next/navigation';

const sections = [
  {
    num: '1', title: 'Aceitação dos Termos',
    content: 'Ao acessar e utilizar a nossa plataforma, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não deve utilizar a plataforma.',
  },
  {
    num: '2', title: 'Descrição do Serviço',
    content: 'Nossa plataforma permite que famílias criem uma página personalizada preenchendo um formulário com o nome do bebê, data de nascimento, uma mensagem especial e fotos. Após o preenchimento, você é direcionado para o checkout e, ao concluir o pagamento, recebe um link com um QR Code exclusivo via email.',
  },
  {
    num: '3', title: 'Cadastro e Segurança',
    content: 'Para utilizar o serviço, você deve fornecer um endereço de email válido. Não compartilharemos seu email com terceiros sem o seu consentimento.',
  },
  {
    num: '4', title: 'Privacidade',
    content: 'Respeitamos a sua privacidade. Não utilizamos seus dados para qualquer tipo de processamento ou venda para terceiros. O email cadastrado é utilizado apenas para o envio do link da página personalizada.',
  },
  {
    num: '5', title: 'Conteúdo do Usuário',
    content: 'Você é responsável pelo conteúdo que insere na plataforma, incluindo fotos, mensagens e informações do bebê. Não nos responsabilizamos por qualquer conteúdo impróprio ou ilegal carregado pelos usuários.',
  },
  {
    num: '6', title: 'Pagamentos e Reembolsos',
    content: 'Todos os pagamentos são processados através do Stripe com total segurança. Após a conclusão do pagamento, você receberá um link para a página personalizada via email. Não oferecemos reembolsos, exceto em casos excepcionais a nosso exclusivo critério.',
  },
  {
    num: '7', title: 'Modificações no Serviço',
    content: 'Comprometemo-nos a manter o serviço ativo pelo período contratado (1 ano no plano básico ou tempo vitalício no plano premium). Em circunstâncias excepcionais fora do nosso controle, reservamo-nos o direito de modificar ou descontinuar o serviço, sempre notificando os usuários com antecedência e buscando alternativas.',
  },
  {
    num: '8', title: 'Limitação de Responsabilidade',
    content: 'Em nenhuma circunstância seremos responsáveis por qualquer dano indireto, incidental, especial ou consequente decorrente de ou relacionado ao uso ou incapacidade de uso da plataforma.',
  },
  {
    num: '9', title: 'Alterações nos Termos',
    content: 'Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos isso, revisaremos a data da "última atualização" no topo desta página. É sua responsabilidade revisá-los periodicamente.',
  },
  {
    num: '10', title: 'Contato',
    content: null,
    isContact: true,
  },
];

const Terms = () => {
  const router = useRouter();

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:'100vh', background:'linear-gradient(155deg,#f0f7ff 0%,#fef0f7 50%,#f5f0ff 100%)', color:'#2d1b2e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'rgba(247,251,255,0.95)', backdropFilter:'blur(14px)', borderBottom:'1px solid #e0eeff', padding:'14px 32px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => router.push('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:9 }}>
          <img src="/chupeta.png" alt="BabyTimee" style={{ width:28, height:28, objectFit:'contain' }} />
          <span className="pf" style={{ fontSize:'1.2rem', fontWeight:700, background:'linear-gradient(90deg,#60a5fa,#e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>BabyTimee</span>
        </button>
        <span style={{ color:'#c4b5c0', fontSize:'0.8rem', marginLeft:4 }}>/ Termos de Uso</span>
      </nav>

      {/* HERO */}
      <div style={{ background:'linear-gradient(155deg,#e0eeff,#fce4ef40)', padding:'56px 24px 44px', textAlign:'center', borderBottom:'1px solid #e0eeff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, background:'radial-gradient(circle,rgba(147,197,253,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, background:'radial-gradient(circle,rgba(249,168,201,0.2),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ fontSize:44, marginBottom:14 }}>📋</div>
        <h1 className="pf" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:700, marginBottom:10 }}>Termos de Uso</h1>
        <p style={{ color:'#a08898', fontSize:'0.88rem' }}>Última atualização: 10 de Março de 2026</p>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 20px 80px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {sections.map((s) => (
            <div key={s.num} style={{ background:'white', borderRadius:20, padding:'24px 28px', border:'1.5px solid #e0eeff', boxShadow:'0 2px 16px rgba(191,219,254,0.1)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: s.isContact ? 0 : 12 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#dbeafe,#fce4ef)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:700, color:'#3b82f6' }}>{s.num}</div>
                <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#2d1b2e', margin:0 }}>{s.title}</h2>
              </div>
              {s.isContact ? (
                <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.75, margin:'12px 0 0' }}>
                  Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco pelo email:{' '}
                  <a href="mailto:contato.babytimee@gmail.com" style={{ color:'#3b82f6', fontWeight:700, textDecoration:'none' }}>contato.babytimee@gmail.com</a>
                </p>
              ) : (
                <p style={{ fontSize:'0.92rem', color:'#4a3550', lineHeight:1.75, margin:0 }}>{s.content}</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:40 }}>
          <button onClick={() => router.push('/')} style={{ background:'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)', color:'white', border:'none', padding:'13px 32px', borderRadius:50, fontSize:'0.95rem', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 6px 20px rgba(96,165,250,0.35)' }}>
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

export default Terms;