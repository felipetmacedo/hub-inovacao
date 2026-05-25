import OpenAI from 'https://deno.land/x/openai@v4.69.0/mod.ts';

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

    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em comunicação científica para o público geral. Sua missão é transformar resumos acadêmicos técnicos em textos acessíveis, mantendo a essência da pesquisa. Escreva em português do Brasil, com linguagem clara e envolvente. Evite jargões. Seja direto e use no máximo 3 parágrafos curtos.',
        },
        {
          role: 'user',
          content: `Transforme este resumo acadêmico em linguagem acessível para gestores públicos e empresários de Recife, sem jargões técnicos:\n\nTítulo: ${title}\nInstituição: ${institution || 'não informada'}\nResumo: ${abstract}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const simplified = completion.choices[0]?.message?.content?.trim() ?? '';

    return new Response(
      JSON.stringify({ simplified }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Erro na função simplify:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
