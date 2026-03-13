export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';
import stripe from '@/app/lib/stripe';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = process.env.STRIPE_WEBHOOK_SECRET;

const sendEmail = async (email: string, urlSlug: string) => {
  await resend.emails.send({
    // TODO: trocar para contato@babytimee.com.br após verificar domínio no Resend
    from: 'BabyTimee <contato@babytimee.com>',
    replyTo: 'contato.babytimee@gmail.com',
    to: email,
    subject: 'A página do seu bebê está pronta! 🍼',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

        <div style="background: linear-gradient(135deg, #dbeafe, #fce4ef); padding: 40px 32px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">🍼</div>
          <h1 style="font-size: 24px; color: #2d1b2e; margin: 0; font-weight: 700;">BabyTimee</h1>
          <p style="color: #6b5c6e; margin: 8px 0 0; font-size: 14px;">Memórias que duram para sempre</p>
        </div>

        <div style="padding: 36px 32px;">
          <h2 style="color: #2d1b2e; font-size: 20px; margin: 0 0 12px;">Parabéns! 🎉</h2>
          <p style="color: #4a3550; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            A página personalizada do seu bebê está pronta! Acesse o link abaixo para visualizar e compartilhar com sua família.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}"
              style="display: inline-block; background: linear-gradient(135deg, #93c5fd, #e879a0); color: white; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 15px; font-weight: 700;">
              Ver a página do meu bebê 💗
            </a>
          </div>

          <p style="color: #a08898; font-size: 13px; line-height: 1.6; margin: 0;">
            Ou copie e cole este link no navegador:<br/>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}" style="color: #3b82f6; word-break: break-all;">
              ${process.env.NEXT_PUBLIC_BASE_URL}/${urlSlug}
            </a>
          </p>
        </div>

        <div style="background: #2d1b2e; padding: 24px 32px; text-align: center;">
          <p style="color: #6b5c6e; font-size: 12px; margin: 0;">
            © 2026 BabyTimee · Todos os direitos reservados<br/>
            Dúvidas? <a href="mailto:contato.babytimee@gmail.com" style="color: #93c5fd;">contato.babytimee@gmail.com</a>
          </p>
        </div>

      </div>
    `,
  });
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

      case 'checkout.session.expired': {
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
      }

      default:
        console.log(`Evento desconhecido: ${event.type}`);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ message: 'Webhook error', ok: false }, { status: 500 });
  }
}