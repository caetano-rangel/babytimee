export const dynamic = 'force-dynamic';

// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';
import stripe from '@/app/lib/stripe';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const secret = process.env.STRIPE_WEBHOOK_SECRET;

const sendEmail = async (email: string, urlSlug: string) => {
  const msg = {
    to: email,
    from: 'contato.babytimee@gmail.com',
    subject: 'Sua Página está Pronta! 🎉',
    text: `Olá! A sua página personalizada está pronta. Acesse: ${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}`,
    html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color: #e879a0;">Parabéns! 🎉</h1>
        <p>Olá,</p>
        <p>A página personalizada do seu bebê está pronta. Clique no link abaixo para acessar:</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}" style="color: #3b82f6; text-decoration: none; font-weight: bold;">Acesse a página do seu bebê aqui! 🍼</a>
        <p style="margin-top: 20px;">Obrigado por usar o BabyTimee! Se tiver dúvidas, entre em contato conosco.</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">© 2026 BabyTimee. Todos os direitos reservados.</p>
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

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed':
        if (event.data.object.payment_status === 'paid') {
          const slug  = event.data.object.metadata?.slug;
          const email = event.data.object.metadata?.email;

          if (slug && email) {
            const { error } = await supabase
              .from('users')
              .update({ status: 'aprovado' })
              .eq('slug', slug);

            if (error) {
              console.error('Erro ao atualizar status:', error);
              return NextResponse.json({ error: 'Erro ao atualizar status.' }, { status: 500 });
            }

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
            .eq('slug', expiredSlug);

          if (error) {
            console.error('Erro ao atualizar status:', error);
            return NextResponse.json({ error: 'Erro ao atualizar status.' }, { status: 500 });
          }
        }
        break;

      default:
        console.log(`Evento desconhecido: ${event.type}`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ message: 'Webhook error', ok: false }, { status: 500 });
  }
}