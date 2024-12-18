// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient'; // Importe o cliente do Supabase
import stripe from '@/app/lib/stripe';
import sgMail from '@sendgrid/mail';

// Configure a chave API do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const secret = process.env.STRIPE_WEBHOOK_SECRET;

// Função para enviar o e-mail usando o SendGrid
const sendEmail = async (email: string, urlSlug: string) => {
  const msg = {
    to: email, // E-mail do cliente
    from: 'contato.babytimee@gmail.com', // Seu e-mail de envio (precisa ser verificado no SendGrid)
    subject: 'Sua Página está Pronta! 🎉',
    text: `Olá! A sua página personalizada está pronta. Acesse a URL: ${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}`,
    html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color: #d97706;">Parabéns! 🎉</h1>
        <p>Olá,</p>
        <p>A sua página personalizada está pronta. Para acessá-la, clique no link abaixo:</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}" style="color:  #85c1e9 ; text-decoration: none; font-weight: bold;">Acesse Sua Página clicando aqui!</a>
        <p style="margin-top: 20px;">Obrigado por usar nosso serviço! Se tiver dúvidas, entre em contato conosco.</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">© 2024 BabyTimee. Todos os direitos reservados.</p>
      </div>`,
  };

  await sgMail.send(msg);
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!secret || !signature) {
      throw new Error('Missing secret or signature');
    }

    // Verifica a assinatura do webhook
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed':
        if (event.data.object.payment_status === 'paid') {
          const slug = event.data.object.metadata?.slug; // Usa a slug do metadata
          const email = event.data.object.metadata?.email; // Captura o e-mail do cliente

          if (slug && email) {
            // Atualiza o status no Supabase
            const { error } = await supabase
              .from('users')
              .update({ status: 'aprovado' })
              .eq('slug', slug); // Atualiza o status para "aprovado"

            if (error) {
              console.error('Erro ao atualizar status no Supabase:', error);
              return NextResponse.json({ error: 'Erro ao atualizar status no Supabase.' }, { status: 500 });
            }

            // Envia o e-mail com o link para a página
            await sendEmail(email, slug);
          }
        }
        break;

      case 'checkout.session.expired':
        const expiredSlug = event.data.object.metadata?.slug;

        if (expiredSlug) {
          const { error } = await supabase
            .from('users')
            .update({ status: 'expirado' })
            .eq('slug', expiredSlug); // Marca como expirado se o pagamento não for feito
          
          if (error) {
            console.error('Erro ao atualizar status no Supabase:', error);
            return NextResponse.json({ error: 'Erro ao atualizar status no Supabase.' }, { status: 500 });
          }
        }
        break;

      default:
        console.log(`Evento desconhecido: ${event.type}`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { message: `Webhook error: ${"error.message"}`, ok: false },
      { status: 500 }
    );
  }
}
