const Terms: React.FC = () => {
    return (
      <div className="min-h-screen bg-[#0e0720] text-white flex items-center justify-center">
        <div className="max-w-3xl p-6">
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="mb-2">Última atualização: 28 de novembro de 2024</p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao acessar e utilizar a nossa plataforma, você concorda em cumprir e ficar vinculado aos
            seguintes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não
            deve utilizar a plataforma.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">2. Descrição do Serviço</h2>
          <p className="mb-4">
            Nossa plataforma permite que casais criem uma página personalizada preenchendo um
            formulário com seu nome, data de início do relacionamento, uma mensagem personalizada e
            até 7 fotos. Após o preenchimento, o casal é direcionado para o checkout e, ao concluir o
            pagamento, recebe um link com um QR Code via email.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">3. Cadastro e Segurança</h2>
          <p className="mb-4">
            Para utilizar o serviço, você deve fornecer um endereço de email válido. Não
            compartilharemos seu email com terceiros.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">4. Privacidade</h2>
          <p className="mb-4">
            Respeitamos a sua privacidade. Não utilizamos seus dados para qualquer tipo de
            processamento ou venda de dados para terceiros. O email cadastrado é utilizado apenas para
            o envio do link da página personalizada.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">5. Conteúdo do Usuário</h2>
          <p className="mb-4">
            Você é responsável pelo conteúdo que insere na plataforma, incluindo fotos, mensagens e
            informações do relacionamento. Não nos responsabilizamos por qualquer conteúdo impróprio
            ou ilegal carregado pelos usuários.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">6. Pagamentos e Reembolsos</h2>
          <p className="mb-4">
            Todos os pagamentos são processados através do Stripe. Após a conclusão do pagamento, o
            casal receberá um link para a página personalizada via email. Não oferecemos reembolsos,
            exceto em casos excepcionais a nosso exclusivo critério.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">7. Modificações no Serviço</h2>
          <p className="mb-4">
            Nós nos comprometemos a manter o serviço ativo e disponível pelo período contratado,
            conforme o plano escolhido (1 ano no plano básico ou tempo vitalício no plano avançado).
            No entanto, em circunstâncias excepcionais que fujam ao nosso controle, como questões
            legais, técnicas ou financeiras, reservamo-nos o direito de modificar ou descontinuar o
            serviço. Caso seja necessário descontinuar o serviço, tomaremos todas as medidas possíveis
            para notificar os usuários com antecedência e garantir a preservação das páginas ou
            oferecer soluções alternativas sempre que possível. O BabyTimee não se responsabiliza por
            eventuais perdas decorrentes de modificações ou descontinuação em situações
            extraordinárias, mas faremos o possível para minimizar o impacto.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">8. Limitação de Responsabilidade</h2>
          <p className="mb-4">
            Em nenhuma circunstância seremos responsáveis por qualquer dano indireto, incidental,
            especial ou consequente decorrente de ou relacionado ao uso ou incapacidade de uso da
            plataforma.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">9. Alterações nos Termos</h2>
          <p className="mb-4">
            Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos isso, revisaremos a
            data da "última atualização" no topo desta página. É sua responsabilidade revisar estes
            Termos de Uso periodicamente para se manter informado sobre quaisquer alterações.
          </p>
  
          <h2 className="text-2xl font-semibold mt-4 mb-2">10. Contato</h2>
          <p className="mb-4">
            Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco pelo
            email: <a href="mailto:contato.babytimee@gmail.com" className="text-blue-400">contato.babytimee@gmail.com</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default Terms;
  