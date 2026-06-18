const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { abstract, title, institution } = await req.json();

    if (!abstract || !title) {
      return new Response(
        JSON.stringify({ error: 'abstract e title são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY não configurada no Supabase secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Você é um especialista em comunicação científica para o público geral. Transforme o resumo acadêmico abaixo em linguagem acessível para gestores públicos e empresários de Recife, sem jargões técnicos. Escreva em português do Brasil, com linguagem clara e envolvente. Use no máximo 3 parágrafos curtos.

Título: ${title}
Instituição: ${institution || 'não informada'}
Resumo técnico: ${abstract}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      throw new Error(`Gemini API retornou ${response.status}: ${errBody}`);
    }

    const result = await response.json();
    const simplified = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!simplified) {
      throw new Error('Gemini não retornou conteúdo. Tente novamente.');
    }

    return new Response(
      JSON.stringify({ simplified }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Erro na função simplify:', err);
    return new Response(
      JSON.stringify({ error: err.message ?? 'Erro interno na geração do resumo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
