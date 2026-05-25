import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProjects(filters = {}) {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('research_projects')
        .select(`
          *,
          researcher:profiles(id, name, institution, avatar, role)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,simplified.ilike.%${filters.search}%,abstract.ilike.%${filters.search}%`
        );
      }
      if (filters.area)        query = query.eq('area', filters.area);
      if (filters.institution) query = query.eq('institution', filters.institution);
      if (filters.type)        query = query.eq('type', filters.type);
      if (filters.ods)         query = query.contains('ods', [parseInt(filters.ods)]);

      const { data, error } = await query;

      if (!cancelled) {
        if (error) setError(error.message);
        else setProjects(data || []);
        setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [filters.search, filters.area, filters.institution, filters.type, filters.ods]);

  return { projects, loading, error };
}
