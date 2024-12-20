"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  const handleClick = () => {
    router.push('/form');
  };

  const handleTermsClick = () => {
    router.push('/terms');
  };

  const handlePrivacyClick = () => {
    router.push('/privacy');
  };

  // Atualiza o scrollY ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center relative"
      style={{
        backgroundImage: "url('/wallp2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay para escurecer o fundo */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Nome e logo do SaaS */}
      <div className="w-full flex items-center justify-center pt-4 pb-2 z-10 relative">
        <img
          src="/chupeta.png"
          alt="BabyTimee Logo"
          className="h-12 w-12 object-contain mr-1"
        />
        <h1
          className="text-2xl up font-bold bg-gradient-to-r from-orange-600 via-orange-400 to-orange-200 text-transparent"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          BabyTimee
        </h1>
      </div>

      {/* Header */}
      <header className="py-8 text-center z-10 relative">
        <h1
          className="text-5xl mb-8 text-left ml-6 font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-200 text-transparent"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Crie Memórias Inesquecíveis!
        </h1>
        <p className="mt-4 text-left font-thin mb-4 ml-6 text-xl">
          Transforme momentos únicos em uma página personalizada!
          <br />
          Com fotos e um{" "}
          <span className="text-amber-700 font-semibold">QR Code</span>, que
          torna o acesso à página fácil e especial.
        </p>

        <button
          onClick={handleClick}
          className="mt-6 w-9/12 bg-gradient-to-r from-amber-900 to-amber-300 font-semibold text-xl px-4 py-3 rounded-md border-2 text-white 
          transition-all duration-300 shadow-lg shadow-orange-600/60 hover:shadow-2xl hover:shadow-orange-500/70"
        >
          Quero fazer meu site
        </button>
      </header>

      {/* Adicionar imagem abaixo do botão */}
      <motion.div
        className="mt-6 z-10 relative"
        initial={{ opacity: 0, y: 150 }} // Inicializa com opacidade 0 e deslocamento vertical
        whileInView={{ opacity: 1, y: 0 }} // Anima para opacidade 1 e posição original
        transition={{ duration: 0.5 }} // Define o tempo da animação
      >
        <Image src="/qr.png" alt="Imagem do site" width={500} height={400} className="rounded-lg" />
      </motion.div>

      {/* Seção "Como Funciona" */}
      <section className="mt-12 px-6 text-center z-10 relative">
      <h2 className="text-4xl font-bold mb-5">Como Funciona?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Etapa 1 */}
        <motion.div
          className="border-2 border-gray-300 p-5 rounded-lg text-white bg-gradient-to-t from-amber-950 via-slate-900 to-black"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }} // Animação quando entra na visão
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl mb-4">1. Preencha os dados</p>
          <Image
            src="/form.jpeg"
            alt="Preencha os dados"
            width={210}
            height={190}
            style={{ transform: "perspective(1000px) rotateX(25deg)" }}
            className="mx-auto rounded-md"
          />
        </motion.div>

        {/* Etapa 2 */}
        <motion.div
          className="border-2 border-gray-300 p-5 rounded-lg text-white bg-gradient-to-t from-amber-950 via-slate-900 to-black"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }} // Animação quando entra na visão
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl mb-9">2. Faça o pagamento</p>
          <Image
            src="/moeda.png"
            alt="Faça o pagamento"
            width={190}
            height={180}
            className="mx-auto"
          />
        </motion.div>

        {/* Etapa 3 */}
        <motion.div
          className="border-2 border-gray-300 p-5 rounded-lg text-white bg-gradient-to-t from-amber-950 via-slate-900 to-black"
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }} // Animação quando entra na visão
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl mb-4 md:mb-14">3. Receba o QR Code</p>
          <Image
            src="/exemplo.png"
            alt="Receba o QR Code"
            width={190}
            height={180}
            className="mx-auto rounded-md"
          />
        </motion.div>

        {/* Etapa 4 */}
        <motion.div
          className="border-2 border-gray-300 p-5 rounded-lg text-white bg-gradient-to-t from-amber-950 via-slate-900 to-black"
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }} // Animação quando entra na visão
          transition={{ duration: 0.8 }}
        >
          <p className="font-semibold text-2xl mb-4">4. Faça uma surpresa!</p>
          <Image
            src="/result.png"
            alt="Compartilhe a página"
            width={220}
            height={200}
            className="mx-auto"
          />
        </motion.div>
      </div>
    </section>


      {/* Seção de Preços */}
      <section className="mt-16 px-6 text-center z-10 relative">
      <h2 className="text-3xl font-semibold mb-8">Preços</h2>
      <div className="flex flex-wrap justify-center gap-12">
        {/* Plano Básico */}
        <motion.div
          className="bg-white p-6 rounded-lg text-gray-700 w-10/12 md:w-[450px] relative"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg mt-2 text-left pl-5">Básico</h3>
          <p className="text-4xl font-bold mt-1 text-gray-700 border-b-2 border-orange-500 pb-4 text-left pl-5 mb-6">R$29</p>
          <ul className="mt-4 space-y-2 text-left">
            <li>
              <svg className="h-5 w-5 text-green-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              1 ano de acesso
            </li>
            <li>
              <svg className="h-5 w-5 text-green-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Até 10 fotos
            </li>
            <li>
              <svg className="h-5 w-5 text-red-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 7.586l4.293-4.293a1 1 0 111.414 1.414L11.414 9l4.293 4.293a1 1 0 11-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 11-1.414-1.414L8.586 9 4.293 4.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Sem música
            </li>
          </ul>
          <button onClick={handleClick} className="text-lg mt-6 bg-gradient-to-r from-orange-500 to-orange-300 text-white px-8 py-2 rounded-md shadow-lg shadow-orange-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-orange-700/60">Quero fazer meu site!</button>
        </motion.div>

        {/* Plano Premium */}
        <motion.div
          className="bg-white p-6 rounded-lg text-gray-700 w-10/12 md:w-[450px] relative border-4 border-orange-500"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg mt-2 text-left pl-5">Premium</h3>
          <p className="text-4xl font-bold mt-1 text-gray-700 border-b-2 border-orange-500 pb-4 text-left pl-5 mb-6">R$59</p>
          <ul className="mt-4 space-y-2 text-left">
            <li>
              <svg className="h-5 w-5 text-green-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Acesso Ilimitado
            </li>
            <li>
              <svg className="h-5 w-5 text-green-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Até 20 fotos
            </li>
            <li>
              <svg className="h-5 w-5 text-green-500 inline mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Com música
            </li>
          </ul>
          <button onClick={handleClick} className="text-lg mt-6 bg-gradient-to-r from-orange-500 to-orange-300 text-white px-8 py-2 rounded-md shadow-lg shadow-orange-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/70">Quero fazer meu site!</button>

          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 text-center w-8/12 bg-gradient-to-r from-orange-500 to-orange-300 text-gray-700 uppercase font-semibold text-sm py-1 px-4 rounded-full">
            <p>mais escolhido!</p>
          </div>
        </motion.div>
      </div>
    </section>


      {/* Seção de Depoimentos */}
      <section className="mt-16 px-6 text-center z-10 relative">
        <h2 className="text-3xl font-semibold mb-6">Depoimentos</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-4 rounded-lg w-72 text-gray-700"
          >
            <Image src="/bitcoin.jpg" alt="Depoimento" width={288} height={512} className="rounded-lg"/>
            <p className="mt-4">"Uma surpresa incrível para guardar para sempre!"</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-4 rounded-lg w-72 text-gray-700"
          >
            <Image src="/bitcoin.jpg" alt="Depoimento" width={288} height={512} className="rounded-lg"/>
            <p className="mt-4">"Adoramos o resultado, emocionante!"</p>
          </motion.div>
        </div>
      </section>

      <motion.div
      className="z-10 relative mt-16 mb-6 flex flex-col lg:flex-row items-center justify-center text-white p-6 rounded-lg space-y-6 lg:space-y-0 lg:space-x-8 border-[0.5px] border-orange-700 w-10/12"
      initial={{ x: -150, opacity: 0 }} // Começa à esquerda e invisível
      whileInView={{ x: 0, opacity: 1 }} // Move para a posição original e fica visível
      transition={{ duration: 0.7 }} // Controla a duração da animação
      >
      {/* QR Code com efeito de brilho */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-200 rounded-lg blur-md opacity-70"></div>
        <img
          src="/exemplo.png"
          alt="QR Code"
          className="relative w-48 h-48 rounded-lg"
        />
      </div>

      {/* Texto e botão */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
        <h1 className="text-2xl font-bold">
          Vamos fazer um presente surpresa para sua familia?
        </h1>
        <p className="text-sm text-gray-400">
          Demora menos de 5 minutos. É sério!
        </p>
        <button
          onClick={handleClick}
          className="text-lg mt-6 bg-gradient-to-r from-orange-500 to-orange-300 text-white px-8 py-2 rounded-md shadow-lg shadow-orange-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/50"
        >
          Quero fazer meu site
        </button>
      </div>
    </motion.div>
      
      <hr className="mt-16 w-full border-gray-700 " />

      {/* Footer */}
      <footer className="z-10 relative mt py-6 text-gray-400 text-center">
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
    </div>
  );
};

export default Home;