import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useConversations() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        project:research_projects(id, title),
        org_user:profiles!conversations_org_user_id_fkey(id, name, avatar, institution),
        researcher:profiles!conversations_researcher_id_fkey(id, name, avatar, institution)
      `)
      .or(`org_user_id.eq.${profile.id},researcher_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    if (!error) setConversations(data || []);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  // Inicia ou recupera conversa entre usuário atual e pesquisador de um projeto
  const startConversation = async (project) => {
    if (!profile?.id) throw new Error('Usuário não autenticado');

    // Verifica se já existe
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('project_id', project.id)
      .eq('org_user_id', profile.id)
      .single();

    if (existing) return existing;

    // Cria nova
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        project_id:    project.id,
        org_user_id:   profile.id,
        researcher_id: project.researcher_id,
      })
      .select()
      .single();

    if (error) throw error;
    await load();
    return data;
  };

  return { conversations, loading, startConversation, reload: load };
}
