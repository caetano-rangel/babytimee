import { NextRequest, NextResponse } from 'next/server';
import stripe from '../../lib/stripe';
import { supabase } from '../../lib/supabaseClient'; // Importe o cliente do Supabase
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extrai os campos do FormData
    const nomeBebe = formData.get('nomeBebe') as string;
    const nomePais = formData.get('nomePais') as string;
    const dataNascimento = formData.get('dataNascimento') as string;
    const horaNascimento = formData.get('horaNascimento') as string;
    const mensagem = formData.get('mensagem') as string;
    const email = formData.get('email') as string;
    const plano = formData.get('plano') as string;
    const fotos = formData.getAll('fotos') as File[];

    if (!nomeBebe || !nomePais || !dataNascimento || !email || !plano) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const slug = `${nomeBebe.toLowerCase()}-${nanoid(10)}`; // Usando nanoid para criar um identificador único

    // Faz o upload das fotos para o Supabase Storage
    const fotoUrls: string[] = [];
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        const fileName = `${slug}-${nanoid(10)}.${foto.type.split('/')[1]}`; // Define o nome e extensão do arquivo
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('uploads')
          .upload(fileName, foto, { upsert: false });

        if (uploadError) {
          console.error('Erro ao fazer upload da foto:', uploadError);
          throw new Error('Erro no upload da foto.'); // Interrompe o processo caso ocorra erro
        }

        // Obter a URL pública do arquivo
        const { data: publicUrlData } = supabase
          .storage
          .from('uploads')
          .getPublicUrl(fileName);

        if (publicUrlData.publicUrl) {
          fotoUrls.push(publicUrlData.publicUrl);
        } else {
          console.error('Erro ao obter a URL pública para o arquivo:', fileName);
          throw new Error('Erro ao obter URL pública para a foto.');
        }
      }
    }

    // Inserção no Supabase
    const { error: insertError } = await supabase
      .from('users') // O nome da sua tabela no Supabase
      .insert([
        {
          slug,
          nomeBebe,
          nomePais,
          dataNascimento,
          horaNascimento,
          mensagem,
          email,
          plano,
          fotos: fotoUrls,
          status: 'pendente',
          createdAt: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error('Erro ao salvar no Supabase:', insertError.message, insertError.details);
      return NextResponse.json({ error: 'Erro ao salvar os dados no Supabase.' }, { status: 500 });
    }

    const priceId = plano === '1ano' ? process.env.STRIPE_PRICE_ID : process.env.STRIPE_PRICE_ID_2;

    // Cria a sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { slug, email },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm?slug=${slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout.' }, { status: 500 });
  }
}
