import { supabase } from './supabaseClient';

const PLAN_EXPIRY_DAYS: Record<string, number> = {
  '1ano':   365,
  'sempre': 365 * 3, // 3 anos
};

const deleteUsersAndPhotos = async () => {
  console.log('[CRON] Iniciando verificação de expiração de planos.');

  try {
    // Buscar todos os usuários aprovados com plano e data de criação
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, fotos, plano, createdAt')
      .eq('status', 'aprovado')
      .eq('deleted', false);

    if (fetchError) {
      console.error('[CRON] Erro ao buscar usuários:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (!users || users.length === 0) {
      console.log('[CRON] Nenhum usuário encontrado.');
      return { success: true, message: 'Nenhum usuário para verificar.' };
    }

    const now = new Date();
    const expired = users.filter(user => {
      const expiryDays = PLAN_EXPIRY_DAYS[user.plano];
      if (!expiryDays || !user.createdAt) return false;
      const createdAt = new Date(user.createdAt);
      const expiresAt = new Date(createdAt.getTime() + expiryDays * 24 * 60 * 60 * 1000);
      return now >= expiresAt;
    });

    if (expired.length === 0) {
      console.log('[CRON] Nenhum plano expirado encontrado.');
      return { success: true, message: 'Nenhum plano expirado.' };
    }

    console.log(`[CRON] ${expired.length} plano(s) expirado(s) encontrado(s). Iniciando deleção...`);

    // Deletar fotos do storage
    for (const user of expired) {
      const { fotos } = user;
      if (fotos && Array.isArray(fotos)) {
        for (const photoUrl of fotos) {
          const filePath = photoUrl.split('/storage/v1/object/public/uploads/')[1];
          if (filePath) {
            const { error: deleteFileError } = await supabase.storage
              .from('uploads')
              .remove([filePath]);

            if (deleteFileError) {
              console.error(`[CRON] Erro ao deletar foto (${filePath}):`, deleteFileError.message);
            } else {
              console.log(`[CRON] Foto deletada: ${filePath}`);
            }
          }
        }
      }
    }

    // Deletar registros expirados
    const expiredIds = expired.map(u => u.id);
    const { error: deleteUsersError } = await supabase
      .from('users')
      .delete()
      .in('id', expiredIds);

    if (deleteUsersError) {
      console.error('[CRON] Erro ao deletar usuários:', deleteUsersError.message);
      return { success: false, error: deleteUsersError.message };
    }

    console.log(`[CRON] ${expired.length} usuário(s) deletado(s) com sucesso.`);
    return { success: true, message: `${expired.length} usuário(s) expirado(s) deletado(s).` };

  } catch (error) {
    console.error('[CRON] Erro inesperado:', error);
    return { success: false, error: 'Erro inesperado ao processar a deleção.' };
  }
};

export default deleteUsersAndPhotos;