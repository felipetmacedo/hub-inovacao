import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useProjectMutations() {
  const { profile } = useAuth();

  const createProject = async (formData) => {
    if (!profile?.id) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('research_projects')
      .insert({
        title:         formData.title,
        institution:   formData.institution,
        area:          formData.area,
        type:          formData.type,
        keywords:      formData.keywords
          ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
          : [],
        ods:           formData.ods || [],
        status:        'review', // vai para aprovação institucional
        researcher_id: profile.id,
        abstract:      formData.abstract,
        simplified:    formData.simplified,
        year:          parseInt(formData.year) || new Date().getFullYear(),
        tags:          formData.tags || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateProject = async (id, updates) => {
    const { error } = await supabase
      .from('research_projects')
      .update(updates)
      .eq('id', id)
      .eq('researcher_id', profile.id); // garante que só edita o próprio
    if (error) throw error;
  };

  const hideProject = async (id) => {
    return updateProject(id, { status: 'hidden' });
  };

  // Usado por gov/org na tela de aprovações
  const approveProject = async (id) => {
    const { error } = await supabase
      .from('research_projects')
      .update({ status: 'published' })
      .eq('id', id);
    if (error) throw error;
  };

  const rejectProject = async (id) => {
    const { error } = await supabase
      .from('research_projects')
      .update({ status: 'draft' }) // devolve para rascunho com feedback
      .eq('id', id);
    if (error) throw error;
  };

  return { createProject, updateProject, hideProject, approveProject, rejectProject };
}
