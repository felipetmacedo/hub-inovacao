const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('[simplify] v2-gemini invoked, method:', req.method);

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Body inválido — JSON malformado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { abstract, title, institution } = body as {
      abstract?: string; title?: string; institution?: string;
    };

    console.log('[simplify] payload:', { title, abstractLen: String(abstract ?? '').length });

    if (!abstract || !title) {
      return new Response(
        JSON.stringify({ error: 'abstract e title são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('[simplify] GEMINI_API_KEY secret ausente');
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY não configurada nos Supabase Secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[simplify] key prefix:', apiKey.substring(0, 6) + '…');

    const prompt =
      `Você é um especialista em comunicação científica para o público geral. ` +
      `Transforme o resumo acadêmico abaixo em linguagem acessível para gestores públicos e empresários de Recife, ` +
      `sem jargões técnicos. Escreva em português do Brasil, com linguagem clara e envolvente. Use no máximo 3 parágrafos curtos.\n\n` +
      `Título: ${title}\n` +
      `Instituição: ${institution ?? 'não informada'}\n` +
      `Resumo técnico: ${abstract}`;

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log('[simplify] calling Gemini…');

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      }),
    });

    console.log('[simplify] Gemini status:', geminiRes.status);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[simplify] Gemini error body:', errText);
      return new Response(
        JSON.stringify({ error: `Gemini retornou ${geminiRes.status} — verifique a chave de API. Detalhes: ${errText.substring(0, 200)}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await geminiRes.json();
    const simplified: string =
      (result?.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

    console.log('[simplify] simplified length:', simplified.length);

    if (!simplified) {
      return new Response(
        JSON.stringify({ error: 'Gemini não retornou conteúdo. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ simplified }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[simplify] uncaught error:', msg);
    return new Response(
      JSON.stringify({ error: msg || 'Erro interno na geração do resumo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
