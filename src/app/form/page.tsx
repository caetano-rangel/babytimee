'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FormData = {
  nomeBebe: string; nomePais: string; dataNascimento: string;
  horaNascimento: string; mensagem: string; email: string;
  plano: '1ano' | 'sempre'; sexo: 'menino' | 'menina';
};
type FieldErrors = Partial<Record<keyof Omit<FormData,'plano'|'sexo'>, string>>;

/* ── Tema por sexo ── */
const theme = {
  menino: {
    primary: '#3b82f6', light: '#dbeafe', medium: '#93c5fd', dark: '#2563eb',
    gradient: 'linear-gradient(135deg,#93c5fd,#60a5fa,#3b82f6)',
    gradientBg: 'linear-gradient(155deg,#f0f7ff 0%,#e0eeff 50%,#f5f0ff 100%)',
    gradientSection: 'linear-gradient(155deg,#f0f7ff,#dbeafe)',
    border: '#dbeafe', shadow: 'rgba(96,165,250,0.35)',
    badgeColor: '#3b82f6', nameColor: '#3b82f6',
    emoji: '💙', label: 'menino',
  },
  menina: {
    primary: '#e879a0', light: '#fce4ef', medium: '#f9a8c9', dark: '#d1598c',
    gradient: 'linear-gradient(135deg,#f9a8c9,#e879a0,#d1598c)',
    gradientBg: 'linear-gradient(155deg,#fff5f8 0%,#fef0f7 50%,#f5f0ff 100%)',
    gradientSection: 'linear-gradient(155deg,#fff5f8,#fce4ef)',
    border: '#fce4ef', shadow: 'rgba(232,121,160,0.35)',
    badgeColor: '#c0507a', nameColor: '#c0507a',
    emoji: '💗', label: 'menina',
  },
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:'block', fontSize:'0.92rem', fontWeight:700, color:'#7c3f5e', marginBottom:2 }}>{label}</label>
      {children}
      {error && <p style={{ color:'#ef4444', fontSize:'0.78rem', marginTop:4 }}>{error}</p>}
    </div>
  );
}

const Form = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sexoParam = searchParams.get('sexo');
    if (sexoParam === 'menino' || sexoParam === 'menina') {
      setFormData(p => ({ ...p, sexo: sexoParam }));
    }
  }, [searchParams]);
  const [step, setStep] = useState<1|2>(1);
  const [formData, setFormData] = useState<FormData>({
    nomeBebe:'', nomePais:'', dataNascimento:'',
    horaNascimento:'', mensagem:'', email:'',
    plano:'1ano', sexo:'menina',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = theme[formData.sexo];
  const maxPhotos = formData.plano === 'sempre' ? 20 : 10;

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'12px 16px', marginTop:8,
    background:'white', color:'#2d1b2e',
    border:`1.5px solid ${t.border}`, borderRadius:14,
    fontSize:'0.97rem', fontFamily:"'Nunito',sans-serif",
    outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]:value }));
    setFieldErrors(p => ({ ...p, [name]:undefined }));
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const maxSize = 800;
      const quality = 0.7;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
          else { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    if (selected.length > maxPhotos) { setFileError(`Máximo de ${maxPhotos} fotos para este plano.`); setFiles(null); }
    else { setFileError(null); setFiles(selected); }
  };

  const validateStep1 = () => {
    const errs: FieldErrors = {};
    if (!formData.nomeBebe)       errs.nomeBebe       = 'Campo obrigatório';
    if (!formData.nomePais)       errs.nomePais       = 'Campo obrigatório';
    if (!formData.email)          errs.email          = 'Campo obrigatório';
    if (!formData.dataNascimento) errs.dataNascimento = 'Campo obrigatório';
    if (!formData.horaNascimento) errs.horaNascimento = 'Campo obrigatório';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (!formData.mensagem) errs.mensagem = 'Campo obrigatório';
    setFieldErrors(p => ({ ...p, ...errs }));
    if (errs.mensagem) return;
    if (!files || files.length < 2) { setFileError('Envie pelo menos 2 fotos.'); return; }
    if (files.length > maxPhotos)   { setFileError(`Máximo de ${maxPhotos} fotos.`); return; }

    const payload = new FormData();
    Object.entries(formData).forEach(([k,v]) => payload.append(k, v));
    const compressed = await Promise.all(Array.from(files).map(compressImage));

    // Valida tamanho total após compressão
    const totalSize = compressed.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 4 * 1024 * 1024) {
      setFileError('Fotos muito grandes. Use fotos menores ou em menor quantidade.');
      return;
    }

    compressed.forEach(f => payload.append('fotos', f));

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/create-checkout', { method:'POST', body:payload });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao processar pedido. Tente novamente.\n\n' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro no checkout:', err);
      alert('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnStyle: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background: t.gradient, color:'white', border:'none',
    padding:'14px 0', borderRadius:50, fontSize:'1rem', fontWeight:700,
    cursor:'pointer', width:'100%',
    boxShadow:`0 8px 24px ${t.shadow}`,
    fontFamily:"'Nunito',sans-serif", transition:'transform 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:'#f7fbff', minHeight:'100vh', color:'#2d1b2e', transition:'background 0.4s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif !important; }
        input:focus, textarea:focus { border-color: ${t.primary} !important; box-shadow: 0 0 0 3px ${t.shadow} !important; }
        .btn-theme:hover { transform:translateY(-2px); box-shadow:0 12px 32px ${t.shadow} !important; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        background:'rgba(247,251,255,0.95)', backdropFilter:'blur(14px)',
        borderBottom:`1px solid ${t.border}`,
        padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100,
      }}>
        <div onClick={() => router.push('/')} style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }}>
          <img src="/chupeta.png" alt="BabyTimee" style={{ width:30, height:30, objectFit:'contain' }} />
          <span className="pf" style={{ fontSize:'1.3rem', fontWeight:700, color: t.nameColor }}>BabyTimee</span>
        </div>
        {/* step indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {[1,2].map(s => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:30, height:30, borderRadius:'50%',
                background: step >= s ? t.gradient : t.light,
                color: step >= s ? 'white' : t.primary,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.8rem', fontWeight:700,
                boxShadow: step >= s ? `0 4px 12px ${t.shadow}` : 'none',
                transition:'all 0.3s',
              }}>{s}</div>
              {s < 2 && <div style={{ width:24, height:2, background: step > 1 ? t.primary : t.light, borderRadius:2, transition:'background 0.3s' }} />}
            </div>
          ))}
        </div>
      </nav>

      {/* ── HEADER ── */}
      <div style={{
        background: t.gradientBg,
        padding:'48px 24px 40px', textAlign:'center', position:'relative', overflow:'hidden',
        transition:'background 0.4s',
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, background:`radial-gradient(circle,${t.medium}33,transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, background:`radial-gradient(circle,rgba(196,181,253,0.16),transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }} />

        <span style={{
          display:'inline-block', background:`linear-gradient(135deg,${t.light},#ede9fe)`,
          borderRadius:50, padding:'5px 18px', fontSize:'0.8rem', color: t.badgeColor, fontWeight:700, marginBottom:14,
        }}>
          {step === 1 ? `${t.emoji} Dados do bebê` : '📸 Fotos & mensagem'}
        </span>
        <h1 className="pf" style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, lineHeight:1.25, color:'#2d1b2e' }}>
          {step === 1
            ? <><em style={{ color: t.primary, fontStyle:'italic' }}>Personalize</em> a página</>
            : <>Quase lá! <em style={{ color: t.primary, fontStyle:'italic' }}>Adicione as fotos<br/></em></>
          }
        </h1>
      </div>

      {/* ── FORM ── */}
      <div style={{ maxWidth:560, margin:'0 auto', padding:'32px 20px 64px' }}>
        <form onSubmit={handleSubmit} noValidate>

          {/* ═══ STEP 1 ═══ */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>

            {/* Sexo do bebê */}
            <div style={{ marginBottom:24 }}>
              <p style={{ fontSize:'0.92rem', fontWeight:700, color:'#7c3f5e', marginBottom:10, textAlign:'center' }}>
                Qual é o sexo do bebê?
              </p>
              <div style={{
                background:'white', borderRadius:20, padding:6,
                border:`1.5px solid ${t.border}`, boxShadow:`0 4px 20px ${t.shadow}20`,
                display:'flex',
              }}>
                {(['menino','menina'] as const).map(s => (
                  <button key={s} type="button"
                    onClick={() => setFormData(p => ({ ...p, sexo:s }))}
                    style={{
                      flex:1, padding:'16px 8px', borderRadius:14, border:'none',
                      cursor:'pointer', fontFamily:"'Nunito',sans-serif",
                      fontWeight:700, fontSize:'1rem', lineHeight:1.4,
                      transition:'all 0.25s',
                      background: formData.sexo === s
                        ? theme[s].gradient : 'transparent',
                      color: formData.sexo === s ? 'white' : '#a08898',
                      boxShadow: formData.sexo === s ? `0 4px 14px ${theme[s].shadow}` : 'none',
                    }}
                  >
                    {s === 'menino' ? '💙 Menino' : '💗 Menina'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plano */}
            <div style={{
              background:'white', borderRadius:20, padding:6,
              border:`1.5px solid ${t.border}`, boxShadow:`0 4px 20px ${t.shadow}20`,
              display:'flex', marginBottom:28,
            }}>
              {(['1ano','sempre'] as const).map(p => (
                <button key={p} type="button"
                  onClick={() => setFormData(d => ({ ...d, plano:p }))}
                  style={{
                    flex:1, padding:'12px 8px', borderRadius:14, border:'none',
                    cursor:'pointer', fontFamily:"'Nunito',sans-serif",
                    fontWeight:700, fontSize:'0.82rem', lineHeight:1.4,
                    transition:'all 0.25s',
                    background: formData.plano === p ? t.gradient : 'transparent',
                    color: formData.plano === p ? 'white' : '#a08898',
                    boxShadow: formData.plano === p ? `0 4px 14px ${t.shadow}` : 'none',
                  }}
                >
                  {p === '1ano' ? <>1 ano · 10 fotos<br/>R$29</> : <>3 anos · 20 fotos<br/>Com música · R$59 ⭐</>}
                </button>
              ))}
            </div>

            {/* Campos */}
            <div style={{ background:'white', borderRadius:20, padding:'28px 24px', border:`1.5px solid ${t.border}`, boxShadow:`0 4px 20px ${t.shadow}15` }}>
              <Field label="Nome do Bebê 👶" error={fieldErrors.nomeBebe}>
                <input type="text" name="nomeBebe" value={formData.nomeBebe} onChange={handleChange}
                  placeholder="Sofia" style={{ ...inputStyle, border: fieldErrors.nomeBebe ? '1.5px solid #f87171' : `1.5px solid ${t.border}` }} />
              </Field>
              <Field label="Nome dos Pais 💑" error={fieldErrors.nomePais}>
                <input type="text" name="nomePais" value={formData.nomePais} onChange={handleChange}
                  placeholder="João e Maria" style={{ ...inputStyle, border: fieldErrors.nomePais ? '1.5px solid #f87171' : `1.5px solid ${t.border}` }} />
              </Field>
              <Field label="Email 📧" error={fieldErrors.email}>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="email@exemplo.com" style={{ ...inputStyle, border: fieldErrors.email ? '1.5px solid #f87171' : `1.5px solid ${t.border}` }} />
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <Field label="Data de Nascimento 📅" error={fieldErrors.dataNascimento}>
                  <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange}
                    style={{ ...inputStyle, border: fieldErrors.dataNascimento ? '1.5px solid #f87171' : `1.5px solid ${t.border}` }} />
                </Field>
                <Field label="Hora de Nascimento ⏰" error={fieldErrors.horaNascimento}>
                  <input type="time" name="horaNascimento" value={formData.horaNascimento} onChange={handleChange}
                    style={{ ...inputStyle, border: fieldErrors.horaNascimento ? '1.5px solid #f87171' : `1.5px solid ${t.border}` }} />
                </Field>
              </div>
            </div>

            <button type="button" className="btn-theme" onClick={() => { if (validateStep1()) setStep(2); }} style={{ ...btnStyle, marginTop:24 }}>
              Continuar →
            </button>
          </div>

          {/* ═══ STEP 2 ═══ */}
          <div style={{ display: step === 2 ? 'block' : 'none' }}>

            <div style={{ background:'white', borderRadius:20, padding:'28px 24px', border:`1.5px solid ${t.border}`, boxShadow:`0 4px 20px ${t.shadow}15`, marginBottom:20 }}>
              <Field label="Mensagem especial 💌" error={fieldErrors.mensagem}>
                <textarea name="mensagem" value={formData.mensagem} onChange={handleChange}
                  placeholder="Escreva algo do coração... capricha! 💗"
                  rows={5}
                  style={{ ...inputStyle, resize:'vertical', minHeight:120, border: fieldErrors.mensagem ? '1.5px solid #f87171' : `1.5px solid ${t.border}` } as React.CSSProperties}
                />
              </Field>
            </div>

            {/* Upload */}
            <div style={{ background:'white', borderRadius:20, padding:'28px 24px', border: fileError ? '1.5px solid #f87171' : `1.5px solid ${t.border}`, boxShadow:`0 4px 20px ${t.shadow}15`, marginBottom:20 }}>
              <p style={{ fontSize:'0.92rem', fontWeight:700, color:'#7c3f5e', marginBottom:12 }}>Fotos do Bebê 📷</p>
              <label htmlFor="fotos-input" style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:10, padding:'28px 16px', borderRadius:14, cursor:'pointer',
                border:`2px dashed ${t.border}`, background: t.light + '40',
                transition:'border-color 0.2s',
              }}>
                <span style={{ fontSize:'2.2rem' }}>🖼️</span>
                <p style={{ color: t.badgeColor, fontWeight:700, fontSize:'0.9rem', textAlign:'center' }}>Clique para selecionar fotos</p>
                <p style={{ color:'#a08898', fontSize:'0.78rem', textAlign:'center' }}>Mínimo 2 · Máximo {maxPhotos} fotos</p>
                {files && files.length > 0 && (
                  <div style={{ background:`linear-gradient(135deg,${t.light},#ede9fe)`, borderRadius:50, padding:'4px 16px', fontSize:'0.8rem', fontWeight:700, color: t.badgeColor }}>
                    {files.length} foto{files.length > 1 ? 's' : ''} selecionada{files.length > 1 ? 's' : ''} ✓
                  </div>
                )}
              </label>
              <input id="fotos-input" type="file" name="fotos" accept="image/*" multiple onChange={handleFileChange} style={{ display:'none' }} />
              {fileError && <p style={{ color:'#ef4444', fontSize:'0.78rem', marginTop:8 }}>{fileError}</p>}
            </div>

            {/* Resumo */}
            <div style={{ background:`linear-gradient(135deg,${t.light}80,#ede9fe80)`, borderRadius:16, padding:'16px 20px', marginBottom:24, border:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:'1.8rem' }}>{formData.sexo === 'menino' ? '💙' : '💗'}</span>
              <div>
                <p style={{ fontWeight:700, color: t.badgeColor, fontSize:'0.9rem' }}>
                  {formData.sexo === 'menino' ? 'Menino' : 'Menina'} · Plano {formData.plano === 'sempre' ? 'Premium' : 'Básico'}
                </p>
                <p style={{ color:'#6b5c6e', fontSize:'0.8rem' }}>
                  {formData.plano === 'sempre' ? '3 anos · 20 fotos · Com música · R$59' : '1 ano · 10 fotos · R$29'}
                </p>
              </div>
              <button type="button" onClick={() => setStep(1)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#a08898', fontSize:'0.78rem', cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>Alterar</button>
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button type="button" onClick={() => setStep(1)} style={{ flex:'0 0 auto', padding:'14px 22px', borderRadius:50, background:'white', border:`1.5px solid ${t.border}`, color: t.primary, fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>
                ← Voltar
              </button>
              <button type="submit" className="btn-theme" style={btnStyle} disabled={isSubmitting}>
                {isSubmitting
                  ? <svg style={{ width:24, height:24, animation:'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                  : `Criar meu site! ${t.emoji}`
                }
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer style={{ background:'#2d1b2e', padding:'36px 24px', textAlign:'center' }}>
        <div style={{ fontSize:26, marginBottom:8 }}>🍼</div>
        <div className="pf" style={{ color: t.medium, fontSize:'1.1rem', fontWeight:700, marginBottom:6 }}>BabyTimee</div>
        <p style={{ color:'#a08898', fontSize:'0.82rem', marginBottom:16 }}>Surpreenda sua família com esse presente incrível!</p>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:14 }}>
          {[['Termos de uso','/terms'],['Termos de privacidade','/privacy']].map(([label,path]) => (
            <button key={path} onClick={() => router.push(path)} style={{ background:'none', border:'none', color:'#a08898', fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = t.medium)}
              onMouseLeave={e => (e.currentTarget.style.color = '#a08898')}
            >{label}</button>
          ))}
        </div>
        <p style={{ color:'#6b5c6e', fontSize:'0.72rem' }}>Copyright © 2024 BabyTimee · Todos os direitos reservados</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </footer>
    </div>
  );
};

export default Form;