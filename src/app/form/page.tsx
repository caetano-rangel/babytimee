'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Form = () => {
  const [formData, setFormData] = useState({
    nomeBebe: '',
    nomePais: '',
    dataNascimento: '',
    horaNascimento: '',
    mensagem: '',
    email: '',
    plano: '1ano',
  });
  const [files, setFiles] = useState<FileList | null>(null); // Armazena os arquivos selecionados
  const [error, setError] = useState<string | null>(null); // Armazena erros de validação de arquivos
  const [isSubmitting, setIsSubmitting] = useState(false); // Controla o estado do botão de envio

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlanoChange = (planoSelecionado: string) => {
    setFormData((prevData) => ({
      ...prevData,
      plano: planoSelecionado,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = event.target.files;
      const maxFiles = formData.plano === 'sempre' ? 20 : 10; // Determina o limite de fotos de acordo com o plano
      if (selectedFiles.length > maxFiles) {
        setError(`Você pode enviar no máximo ${maxFiles} fotos para este plano.`);
        setFiles(null); // Limpa os arquivos selecionados se excederem o limite
      } else {
        setError(null); // Reseta o erro se a quantidade de fotos for válida
        setFiles(selectedFiles); // Atualiza os arquivos selecionados
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors: { [key: string]: string } = {};
    if (!formData.nomeBebe) errors.nomeBebe = 'Este campo é necessário';
    if (!formData.nomePais) errors.nomePais = 'Este campo é necessário';
    if (!formData.dataNascimento) errors.dataNascimento = 'Este campo é necessário';
    if (!formData.horaNascimento) errors.horaNascimento = 'Este campo é necessário';
    if (!formData.email) errors.email = 'Este campo é necessário';
    if (!formData.mensagem) errors.mensagem = 'Este campo é necessário';

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Impede o envio do formulário se houver erros
    }

    const minFotos = 2;
    if (!files || files.length < minFotos) {
      setError(`Por favor, envie pelo menos ${minFotos} fotos.`);
      return; // Impede o envio do formulário se o número de fotos for insuficiente
    }

    // Verifica se o número de fotos está dentro do limite
    const maxFiles = formData.plano === 'sempre' ? 20 : 10;
    if (files && files.length > maxFiles) {
      setError(`Você pode enviar no máximo ${maxFiles} fotos para este plano.`);
      return; // Impede o envio do formulário se o limite for ultrapassado
    }

    const formPayload = new FormData();

    // Adiciona os dados do formulário ao FormData
    for (const key in formData) {
      formPayload.append(key, formData[key as keyof typeof formData]);
    }

    // Adiciona os arquivos ao FormData
    if (files) {
      Array.from(files).forEach((file) => {
        formPayload.append('fotos', file); // 'fotos' será o campo enviado
      });
    }

    try {
      setIsSubmitting(true); // Desativa o botão de envio enquanto está processando
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        body: formPayload, // Envia o FormData
      });

      const data = await response.json();
      console.log(data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Erro ao redirecionar para o Stripe.');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
    } finally {
      setIsSubmitting(false); // Habilita o botão novamente após o processamento
    }
  };

  const [fieldErrors, setFieldErrors] = useState<{
    nomeBebe?: string;
    nomePais?: string;
    dataNascimento?: string;
    horaNascimento?: string;
    mensagem?: string;
    email?: string;
  }>({});

  const router = useRouter();

  const handleTermsClick = () => {
    router.push('/terms');
  };

  const handlePrivacyClick = () => {
    router.push('/privacy');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center bg-[#295566] w-full min-h-screen text-black p-8 sm:p-6"
      style={{
        backgroundImage: `
          url('/nuvem.png'), 
          url('/nuvem.png'), 
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png'),
          url('/nuvem.png')`,
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundPosition: '5% 20%, 60% 60%, 85% 30%, 10% 80%, 70% 10%, 90% 90%', //posição para a nuvem
        backgroundSize: '150px, 200px, 180px, 160px, 190px, 180px, 130px', // Ajuste no tamanho
        opacity: 0.8, // Leve transparência para as nuvens
      }}
    >
      <h1 className="text-4xl font-semibold text-center mb-8 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-200 bg-clip-text text-transparent sm:pt-2">
        Transforme Memórias em um Site Incrível:<br></br>Comece Aqui!
      </h1>

      {/* Opções de plano */}
      <div className="flex justify-center mb-6 w-full max-w-lg shadow-2xl">
        <button
          type="button"
          onClick={() => handlePlanoChange('1ano')}
          className={`flex-1 p-3 font-semibold rounded-l-lg ${formData.plano === '1ano' ? 'bg-gradient-to-r from-orange-600 to-orange-300 text-black' : 'bg-white text-black'} border border-r-0 border-gray-300`}
        >
          1 ano, 10 fotos - R$29
        </button>
        <button
          type="button"
          onClick={() => handlePlanoChange('sempre')}
          className={`flex-1 p-3 font-semibold rounded-r-lg ${formData.plano === 'sempre' ? 'bg-gradient-to-r from-orange-600 to-orange-300 text-black' : 'bg-white text-black'} border border-l-0 border-gray-300`}
        >
          Para sempre, 20 fotos - R$49
        </button>
      </div>

      {/* Nome do Bebê */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Nome do Bebê:</span>
        <input
          type="text"
          name="nomeBebe"
          value={formData.nomeBebe}
          placeholder="Juca"
          onChange={handleChange}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.nomeBebe ? 'border-2 border-red-500' : ''}`}
        />
        {fieldErrors.nomeBebe && <p className="text-red-500 text-sm">{fieldErrors.nomeBebe}</p>}
      </label>

      {/* Nome dos Pais */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Nome dos Pais:</span>
        <input
          type="text"
          name="nomePais"
          value={formData.nomePais}
          placeholder="João e Maria"
          onChange={handleChange}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.nomePais ? 'border-2 border-red-500' : ''}`}
        />
        {fieldErrors.nomePais && <p className="text-red-500 text-sm">{fieldErrors.nomePais}</p>}
      </label>

      {/* Email */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Email:</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email@teste.com"
          onChange={handleChange}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.email ? 'border-2 border-red-500' : ''}`}
        />
        {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
      </label>

      {/* Data de Nascimento */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Data de Nascimento:</span>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.dataNascimento ? 'border-2 border-red-500' : ''}`}
        />
        {fieldErrors.dataNascimento && <p className="text-red-500 text-sm">{fieldErrors.dataNascimento}</p>}
      </label>

      {/* Hora de Nascimento */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Hora de Nascimento:</span>
        <input
          type="time"
          name="horaNascimento"
          value={formData.horaNascimento}
          onChange={handleChange}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.horaNascimento ? 'border-2 border-red-500' : ''}`}
        />
        {fieldErrors.horaNascimento && <p className="text-red-500 text-sm">{fieldErrors.horaNascimento}</p>}
      </label>

      {/* Mensagem */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Mensagem:</span>
        <textarea
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          placeholder="Escreva sua mensagem aqui! Capricha!"
          rows={4}
          required
          className={`w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg ${fieldErrors.mensagem ? 'border-2 border-red-500' : ''}`}
        ></textarea>
        {fieldErrors.mensagem && <p className="text-red-500 text-sm">{fieldErrors.mensagem}</p>}
      </label>

      {/* Fotos do Bebê */}
      <label className="block w-full max-w-lg mb-4">
        <span className="text-lg font-medium text-white">Fotos do Bebê:</span>
        <input
          type="file"
          name="fotos"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="w-full p-3 mt-2 bg-white shadow-2xl text-black rounded-lg"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Exibe a mensagem de erro se houver */}
      </label>

      {/* Botão de Envio */}
      <button
        type="submit"
        className="w-full mt-14 max-w-lg p-3 bg-gradient-to-r from-green-600 to-green-300 text-white shadow-lg shadow-green-600/60 text-3xl rounded-lg transition duration-300 flex justify-center items-center hover:shadow-xl hover:shadow-green-500/40"
      >
        {isSubmitting ? (
          <svg
            className="w-8 h-8 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              d="M4 12a8 8 0 0 1 16 0"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          'Criar seu site!'
        )}
      </button>

      {/* Footer */}
      <footer className="mt-6 py-6 text-gray-400 text-center">
        {/* Logo e descrição */}
        <div className="mb-3">
          <img src="/chupeta.png" width={80} height={100} alt="Logo" className="mx-auto mb-2 h-18" />
          <p className="text-base text-white">
            Surpreenda sua familia com esse presente incrivel!
          </p>
        </div>

        {/* Direitos autorais */}
        <p className="mb-4 text-xs">Copyright © 2024 BabyTimee - Todos os direitos reservados</p>

        {/* Legal */}
        <div className="text-sm">
          <h3 className="text-gray-200 font-semibold mb-2">Legal</h3>
          <ul className="space-y-1">
            <li><a onClick={handleTermsClick}  className="hover:text-white cursor-pointer">Termos de uso</a></li>
            <li><a onClick={handlePrivacyClick} className="hover:text-white cursor-pointer">Termos de privacidade</a></li>
          </ul>
        </div>
      </footer>
    </form>
  );
};

export default Form;
