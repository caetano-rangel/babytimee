// app/api/baby-postits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!   // service role para bypassar RLS no servidor
);

/* ── GET /api/baby-postits?slug=... ── */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 });

  const { data, error } = await supabase
    .from('baby_postits')
    .select('id, nome, mensagem, cor, created_at')
    .eq('slug', slug)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ postits: data });
}

/* ── POST /api/baby-postits ── */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, nome, mensagem, cor } = body;

  if (!slug || !mensagem?.trim())
    return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });

  if (mensagem.length > 200)
    return NextResponse.json({ error: 'Mensagem muito longa.' }, { status: 400 });

  // Verifica que a página existe
  const { data: baby, error: babyErr } = await supabase
    .from('users')
    .select('id')
    .eq('slug', slug)
    .single();

  if (babyErr || !baby)
    return NextResponse.json({ error: 'Página não encontrada.' }, { status: 404 });

  const coresValidas = ['amarelo', 'rosa', 'verde', 'azul', 'roxo', 'laranja'];
  const corFinal = coresValidas.includes(cor) ? cor : 'amarelo';

  const { data, error } = await supabase
    .from('baby_postits')
    .insert({
      slug,
      nome:     nome?.trim().slice(0, 60) || 'Anônimo',
      mensagem: mensagem.trim(),
      cor:      corFinal,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ postit: data }, { status: 201 });
}