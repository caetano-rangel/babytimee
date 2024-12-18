import { supabase } from './supabaseClient';

const deleteUsersAndPhotos = async () => {
  console.log('[API] Iniciando deleção manual de usuários e fotos.');

  try {
    // Buscar usuários marcados como "deleted" e obter suas fotos
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, fotos')
      .eq('deleted', true);

    if (fetchError) {
      console.error('[API] Erro ao buscar usuários:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (!users || users.length === 0) {
      console.log('[API] Nenhum usuário marcado como "deleted" encontrado.');
      return { success: true, message: 'Nenhum usuário para deletar.' };
    }

    // Deletar as fotos de cada usuário do storage
    for (const user of users) {
      const { fotos } = user;

      if (fotos && Array.isArray(fotos)) {
        for (const photoUrl of fotos) {
          const filePath = photoUrl.split('/storage/v1/object/public/uploads/')[1];
          if (filePath) {
            const { error: deleteFileError } = await supabase.storage
              .from('uploads')
              .remove([filePath]);

            if (deleteFileError) {
              console.error(`[API] Erro ao deletar foto (${filePath}):`, deleteFileError.message);
            } else {
              console.log(`[API] Foto deletada com sucesso: ${filePath}`);
            }
          }
        }
      }
    }

    // Deletar os usuários marcados como "deleted"
    const { error: deleteUsersError } = await supabase
      .from('users')
      .delete()
      .eq('deleted', true);

    if (deleteUsersError) {
      console.error('[API] Erro ao deletar usuários:', deleteUsersError.message);
      return { success: false, error: deleteUsersError.message };
    }

    console.log('[API] Usuários deletados com sucesso.');
    return { success: true, message: 'Usuários e fotos deletados com sucesso.' };
  } catch (error) {
    console.error('[API] Erro inesperado:', error);
    return { success: false, error: 'Erro inesperado ao processar a deleção.' };
  }
};

export default deleteUsersAndPhotos;
