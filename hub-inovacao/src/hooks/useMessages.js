import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useMessages(conversationId) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  // Carrega histórico inicial
  const load = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(id, name, avatar, role)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error) setMessages(data || []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => { load(); }, [load]);

  // Realtime: escuta novas mensagens nesta conversa
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:conv:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Evita duplicar msg do próprio remetente (que já inseriu localmente)
          setMessages(prev => {
            const exists = prev.some(m => m.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [conversationId]);

  // Envia mensagem
  const sendMessage = async (text) => {
    if (!text.trim() || !profile?.id || !conversationId) return;

    const optimistic = {
      id:              `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id:       profile.id,
      text,
      created_at:      new Date().toISOString(),
      sender:          profile,
    };

    // Atualização otimista
    setMessages(prev => [...prev, optimistic]);

    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: profile.id, text })
      .select('*, sender:profiles(id, name, avatar, role)')
      .single();

    if (error) {
      // Reverte em caso de erro
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      throw error;
    }

    // Substitui otimista pelo real
    setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
  };

  return { messages, loading, sendMessage };
}
