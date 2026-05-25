import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProjectMutations } from './useProjectMutations';

export function useApprovals() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const { approveProject, rejectProject } = useProjectMutations();

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('research_projects')
      .select('*, researcher:profiles(id, name, institution, avatar)')
      .eq('status', 'review')
      .order('updated_at', { ascending: true });

    if (!error) setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id) => {
    await approveProject(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const reject = async (id) => {
    await rejectProject(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return { items, loading, approve, reject, reload: load };
}
