const Privacy: React.FC = () => {
    return (
      <div className="min-h-screen bg-[#0e0720] text-white flex items-center justify-center">
        <div className="max-w-3xl p-6">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="mb-2">Última atualização: 28 de novembro de 2024</p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">1. Introdução</h2>
          <p className="mb-4">
            Sua privacidade é importante para nós. Esta Política de Privacidade descreve como
            coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza
            nossa plataforma.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">2. Informações que Coletamos</h2>
          <p className="mb-4">
            Coletamos as seguintes informações quando você utiliza nossa plataforma:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Informações de Cadastro:</strong> Nome do bebê, nome dos pais, data de nascimento,
              mensagem personalizada, fotos do bebê e endereço de email cadastrado.
            </li>
            <li>
              <strong>Informações de Pagamento:</strong> Endereço de email cadastrado no Stripe para
              processamento do pagamento e envio do link da página personalizada.
            </li>
          </ul>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">3. Como Usamos Suas Informações</h2>
          <p className="mb-4">Utilizamos suas informações para:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Processar o pagamento e enviar o link da página personalizada via email.</li>
            <li>Personalizar e criar a página do bebê com as informações fornecidas.</li>
            <li>Melhorar nossos serviços e suporte ao cliente.</li>
          </ul>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">4. Compartilhamento de Informações</h2>
          <p className="mb-4">
            Não compartilhamos suas informações pessoais com terceiros, exceto conforme necessário
            para processar pagamentos (Stripe) e conforme exigido por lei.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">5. Segurança</h2>
          <p className="mb-4">
            Implementamos medidas de segurança para proteger suas informações pessoais contra acesso,
            uso ou divulgação não autorizados. No entanto, nenhuma transmissão de dados pela internet
            é completamente segura, e não podemos garantir a segurança absoluta.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">6. Retenção de Dados</h2>
          <p className="mb-4">
            Reteremos suas informações pessoais apenas pelo tempo necessário para cumprir as
            finalidades para as quais foram coletadas ou conforme exigido por lei.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">7. Seus Direitos</h2>
          <p className="mb-4">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer
            esses direitos, entre em contato conosco pelo email:{' '}
            <a href="mailto:contato.babytimee@gmail.com" className="text-blue-400">
              contato.babytimee@gmail.com
            </a>
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">8. Alterações nesta Política de Privacidade</h2>
          <p className="mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos isso,
            revisaremos a data da "última atualização" no topo desta página. É sua responsabilidade
            revisar esta política periodicamente para se manter informado sobre quaisquer alterações.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">9. Contato</h2>
          <p className="mb-4">
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco
            pelo email:{' '}
            <a href="mailto:contato.babytimee@gmail.com" className="text-blue-400">
              contato.babytimee@gmail.com
            </a>
          </p>
        </div>
      </div>
    );
  };
  
  export default Privacy;
  