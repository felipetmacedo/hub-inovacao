import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Supabase: variáveis de ambiente não configuradas. Copie .env.example para .env e preencha as credenciais.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
