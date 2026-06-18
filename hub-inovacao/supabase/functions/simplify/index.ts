const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('[simplify] v3-groq invoked');

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

    if (!abstract || !title) {
      return new Response(
        JSON.stringify({ error: 'abstract e title são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GROQ_API_KEY');
    if (!apiKey) {
      console.error('[simplify] GROQ_API_KEY secret ausente');
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY não configurada nos Supabase Secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[simplify] calling Groq...');

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista em comunicação científica para o público geral. ' +
              'Sua missão é transformar resumos acadêmicos técnicos em textos acessíveis, mantendo a essência da pesquisa. ' +
              'Escreva em português do Brasil, com linguagem clara e envolvente, sem jargões. ' +
              'Use no máximo 3 parágrafos curtos.',
          },
          {
            role: 'user',
            content:
              `Transforme este resumo em linguagem acessível para gestores públicos e empresários de Recife:\n\n` +
              `Título: ${title}\n` +
              `Instituição: ${institution ?? 'não informada'}\n` +
              `Resumo técnico: ${abstract}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    console.log('[simplify] Groq status:', groqRes.status);

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('[simplify] Groq error:', errText);
      return new Response(
        JSON.stringify({ error: `Groq retornou ${groqRes.status}: ${errText.substring(0, 200)}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await groqRes.json();
    const simplified: string = (result?.choices?.[0]?.message?.content ?? '').trim();

    console.log('[simplify] success, length:', simplified.length);

    if (!simplified) {
      return new Response(
        JSON.stringify({ error: 'Groq não retornou conteúdo. Tente novamente.' }),
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
