export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const slug   = formData.get('slug')   as string;
    const email  = formData.get('email')  as string;
    const action = formData.get('action') as string; // 'validate' | 'remove' | 'add'

    if (!slug || !email || !action) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    // ── Busca o registro ──
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('email, plano, fotos, status')
      .eq('slug', slug)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Página não encontrada.' }, { status: 404 });
    }

    if (user.status !== 'aprovado') {
      return NextResponse.json({ error: 'Página não está ativa.' }, { status: 403 });
    }

    if (user.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Email incorreto.' }, { status: 401 });
    }

    const maxFotos   = user.plano === 'sempre' ? 20 : 10;
    const fotosAtuais: string[] = user.fotos || [];

    /* ── VALIDAR email ── */
    if (action === 'validate') {
      return NextResponse.json({ ok: true, plano: user.plano, total: fotosAtuais.length, max: maxFotos });
    }

    /* ── REMOVER foto ── */
    if (action === 'remove') {
      const fotoUrl = formData.get('fotoUrl') as string;
      if (!fotoUrl) return NextResponse.json({ error: 'URL da foto ausente.' }, { status: 400 });

      const filePath = fotoUrl.split('/storage/v1/object/public/uploads/')[1];
      if (filePath) {
        await supabase.storage.from('uploads').remove([filePath]);
      }

      const novasFotos = fotosAtuais.filter(f => f !== fotoUrl);
      const { error } = await supabase
        .from('users')
        .update({ fotos: novasFotos })
        .eq('slug', slug);

      if (error) return NextResponse.json({ error: 'Erro ao remover foto.' }, { status: 500 });

      return NextResponse.json({ fotos: novasFotos, total: novasFotos.length, max: maxFotos });
    }

    /* ── ADICIONAR foto ── */
    if (action === 'add') {
      if (fotosAtuais.length >= maxFotos) {
        return NextResponse.json({ error: `Limite de ${maxFotos} fotos atingido.` }, { status: 400 });
      }

      const file = formData.get('foto') as File;
      if (!file) return NextResponse.json({ error: 'Foto ausente.' }, { status: 400 });

      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'Foto muito grande. Máximo 4MB.' }, { status: 400 });
      }

      const ext      = file.type.split('/')[1] || 'jpg';
      const fileName = `${slug}/${nanoid(10)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, { upsert: false });

      if (uploadError) return NextResponse.json({ error: 'Erro no upload.' }, { status: 500 });

      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      const novasFotos = [...fotosAtuais, publicUrlData.publicUrl];

      const { error } = await supabase
        .from('users')
        .update({ fotos: novasFotos })
        .eq('slug', slug);

      if (error) return NextResponse.json({ error: 'Erro ao salvar foto.' }, { status: 500 });

      return NextResponse.json({ fotos: novasFotos, total: novasFotos.length, max: maxFotos });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });

  } catch (error) {
    console.error('Erro na edição de fotos:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}