import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useMyProjects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('research_projects')
      .select('*, researcher:profiles(id, name, institution, avatar)')
      .eq('researcher_id', profile.id)
      .neq('status', 'hidden')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setProjects(data || []);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  return { projects, loading, error, reload: load };
}
