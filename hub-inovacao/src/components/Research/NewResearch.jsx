import { useState } from 'react';
import { AREAS, TYPES, INSTITUTIONS, ODS_LIST } from '../../data';
import { useMobile } from '../../hooks/useMobile';
import { useProjectMutations } from '../../hooks/useProjectMutations';
import { supabase } from '../../lib/supabase';

const STEPS = ['Dados Básicos', 'Resumo Técnico', 'Simplificação IA', 'ODS & Revisão', 'Enviar'];

export function NewResearch({ onDone, project }) {
  const mobile = useMobile();
  const { createProject, editProject } = useProjectMutations();
  const isEditing = !!project;

  const initialForm = project ? {
    title:       project.title || '',
    area:        project.area || '',
    type:        project.type || '',
    institution: project.institution || 'UFPE',
    year:        String(project.year || new Date().getFullYear()),
    keywords:    (project.keywords || []).join(', '),
    abstract:    project.abstract || '',
    simplified:  project.simplified || '',
    ods:         project.ods || [],
  } : { title: '', area: '', type: '', institution: 'UFPE', year: String(new Date().getFullYear()), keywords: '', abstract: '', simplified: '', ods: [] };

  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(initialForm);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText]       = useState(project?.simplified || '');
  const [aiDone, setAiDone]       = useState(isEditing && !!project?.simplified);
  const [aiError, setAiError]     = useState('');
  const [suggestedOds, setSuggestedOds] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const ODS_MAP = { 'Saúde': [3, 11], 'Tecnologia': [9, 11], 'Educação': [4, 10], 'Meio Ambiente': [13, 15, 11], 'Urbanismo': [11, 1], 'Economia': [8, 1], 'Segurança Pública': [16, 11], 'Agro & Alimentação': [2, 1] };

  const callAI = async () => {
    if (!form.abstract && !form.title) return;
    setAiLoading(true); setAiText(''); setAiDone(false); setAiError('');

    try {
      const { data, error } = await supabase.functions.invoke('simplify', {
        body: { abstract: form.abstract, title: form.title, institution: form.institution, area: form.area },
      });

      if (error) throw error;

      const simplified = data?.simplified || '';
      if (!simplified) throw new Error('A IA não retornou conteúdo. Tente novamente.');

      setAiText(simplified);
      set('simplified', simplified);
      setAiDone(true);
      setSuggestedOds(ODS_MAP[form.area] || [9, 11]);
    } catch (err) {
      setAiError(err.message || 'Não foi possível gerar a versão simplificada. Verifique sua conexão e tente novamente.');
      setAiDone(false);
    }
    setAiLoading(false);
  };

  const toggleOds = (id) => setForm(f => ({ ...f, ods: f.ods.includes(id) ? f.ods.filter(x => x !== id) : [...f.ods, id] }));

  const handleSubmit = async () => {
    setSubmitError('');
    try {
      if (isEditing) {
        await editProject(project.id, form);
      } else {
        await createProject(form);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Erro ao enviar pesquisa. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f8ff', flexDirection: 'column', gap: 24, padding: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(5,150,105,0.12)', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>✓</div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0d1f3c' }}>
            {isEditing ? 'Pesquisa atualizada e enviada para aprovação!' : 'Pesquisa enviada para aprovação!'}
          </h2>
          <p style={{ color: '#6b7fa3', fontSize: 14, marginTop: 8 }}>A instituição irá revisar e publicar em breve.</p>
        </div>
        <button onClick={onDone} style={{ background: 'linear-gradient(135deg,#3b8eff,#0040cc)', border: 'none', borderRadius: 8, padding: '12px 28px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Ver Minhas Pesquisas</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, width: '100%', overflow: 'auto', background: '#f4f8ff' }}>
      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: mobile ? '14px 16px' : '20px 32px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0d1f3c' }}>{isEditing ? 'Editar Pesquisa' : 'Cadastrar Nova Pesquisa'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 18, overflowX: 'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'contents' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? '#059669' : step === i + 1 ? '#0060e0' : '#eef4ff', border: `2px solid ${step > i + 1 ? '#059669' : step === i + 1 ? '#0060e0' : 'rgba(0,60,180,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: step >= i + 1 ? '#fff' : '#6b7fa3', transition: 'all 0.3s' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, color: step === i + 1 ? '#0060e0' : '#6b7fa3', whiteSpace: 'nowrap', fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#059669' : 'rgba(0,60,180,0.12)', margin: '0 4px', marginBottom: 18, transition: 'background 0.3s', minWidth: 16 }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: mobile ? '14px 16px' : '28px 32px' }}>
        {/* Step 1 */}
        {step === 1 && (
          <div style={ws.card}>
            <h3 style={ws.stepTitle}>Dados Básicos do Projeto</h3>
            <div style={ws.field}>
              <label style={ws.label}>Título da pesquisa *</label>
              <input style={ws.input} placeholder="Ex: Detecção de dengue com machine learning..." value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div style={ws.field}>
                <label style={ws.label}>Área</label>
                <select style={ws.input} value={form.area} onChange={e => set('area', e.target.value)}>
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={ws.field}>
                <label style={ws.label}>Tipo</label>
                <select style={ws.input} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="">Selecione...</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={ws.field}>
                <label style={ws.label}>Instituição</label>
                <select style={ws.input} value={form.institution} onChange={e => set('institution', e.target.value)}>
                  {INSTITUTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div style={ws.field}>
                <label style={ws.label}>Ano</label>
                <input style={ws.input} value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
            </div>
            <div style={ws.field}>
              <label style={ws.label}>Palavras-chave (separadas por vírgula)</label>
              <input style={ws.input} placeholder="saúde pública, machine learning, recife..." value={form.keywords} onChange={e => set('keywords', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={ws.card}>
            <h3 style={ws.stepTitle}>Resumo Técnico</h3>
            <div style={{ background: 'rgba(0,96,224,0.05)', border: '1px solid rgba(0,96,224,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 4, fontSize: 13, color: '#4a5a7a' }}>
              💡 Escreva o resumo como você faria num artigo. A IA vai criar uma versão mais acessível no próximo passo.
            </div>
            <div style={ws.field}>
              <label style={ws.label}>Resumo / Abstract *</label>
              <textarea style={{ ...ws.input, minHeight: 180, resize: 'vertical' }} placeholder="Descreva os objetivos, metodologia e resultados esperados..." value={form.abstract} onChange={e => set('abstract', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 3 — AI */}
        {step === 3 && (
          <div style={ws.card}>
            <h3 style={ws.stepTitle}>✨ Simplificação por IA</h3>
            <p style={{ fontSize: 14, color: '#6b7fa3', marginTop: 0, marginBottom: 20 }}>Geramos automaticamente uma versão em linguagem acessível. Você pode editar antes de publicar.</p>
            {aiError && (
              <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span>⚠ {aiError}</span>
                <button onClick={callAI} style={{ flexShrink: 0, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 6, padding: '6px 14px', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Tentar novamente</button>
              </div>
            )}
            {!aiLoading && !aiDone && (
              <button onClick={callAI} style={{ ...ws.btn, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span>✨</span> {aiError ? 'Gerar novamente' : 'Gerar versão simplificada com IA'}
              </button>
            )}
            {(aiLoading || aiDone) && (
              <div style={{ background: 'rgba(0,96,224,0.05)', border: '1px solid rgba(0,96,224,0.18)', borderRadius: 10, padding: '20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>✨</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0060e0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Versão Simplificada {aiLoading && '•••'}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#2d3f6b', lineHeight: 1.7 }}>
                  {aiText}
                  <span style={{ display: aiLoading ? 'inline' : 'none', borderRight: '2px solid #0060e0', marginLeft: 2, animation: 'blink 0.8s infinite' }}>|</span>
                </p>
              </div>
            )}
            {aiDone && (
              <div style={ws.field}>
                <label style={ws.label}>Editar versão simplificada</label>
                <textarea style={{ ...ws.input, minHeight: 130, resize: 'vertical' }} value={form.simplified} onChange={e => set('simplified', e.target.value)} />
              </div>
            )}
          </div>
        )}

        {/* Step 4 — ODS */}
        {step === 4 && (
          <div style={ws.card}>
            <h3 style={ws.stepTitle}>ODS e Revisão Final</h3>
            {suggestedOds.length > 0 && (
              <div style={{ background: 'rgba(0,96,224,0.05)', border: '1px solid rgba(0,96,224,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 4, fontSize: 13, color: '#4a5a7a' }}>
                💡 Sugestão automática: ODS {suggestedOds.join(' e ')}.
                <button onClick={() => setForm(f => ({ ...f, ods: suggestedOds }))} style={{ marginLeft: 8, background: 'rgba(0,96,224,0.1)', border: '1px solid rgba(0,96,224,0.25)', borderRadius: 4, padding: '2px 10px', color: '#0060e0', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Aplicar</button>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
              {ODS_LIST.map(o => (
                <button key={o.id} onClick={() => toggleOds(o.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, border: `1px solid ${form.ods.includes(o.id) ? o.color + '55' : 'rgba(0,60,180,0.12)'}`, background: form.ods.includes(o.id) ? o.color + '12' : '#ffffff', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 3, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{o.id}</span>
                  <span style={{ fontSize: 11, color: form.ods.includes(o.id) ? '#0d1f3c' : '#6b7fa3', lineHeight: 1.3 }}>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div style={ws.card}>
            <h3 style={ws.stepTitle}>Pré-visualização</h3>
            <div style={{ background: '#f7faff', border: '1px solid rgba(0,60,180,0.12)', borderRadius: 10, padding: '20px', marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0d1f3c' }}>{form.title || '(sem título)'}</h4>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {form.area && <span style={{ fontSize: 10, fontWeight: 700, color: '#0060e0', background: 'rgba(0,96,224,0.1)', borderRadius: 4, padding: '2px 8px' }}>{form.area}</span>}
                {form.type && <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '2px 8px' }}>{form.type}</span>}
                {form.institution && <span style={{ fontSize: 10, color: '#6b7fa3', background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '2px 8px' }}>{form.institution}</span>}
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#4a5a7a', lineHeight: 1.6 }}>{form.simplified || form.abstract || '(sem resumo)'}</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {form.ods.map(id => {
                  const o = ODS_LIST.find(x => x.id === id);
                  return o ? <span key={id} style={{ fontSize: 10, color: o.color, background: o.color + '18', border: `1px solid ${o.color}44`, borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>ODS {id}</span> : null;
                })}
              </div>
            </div>
            {isEditing && (
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#b45309' }}>
                ⚠ Ao salvar, a pesquisa voltará para aprovação institucional antes de ser republicada.
              </div>
            )}
            <div style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#4a5a7a' }}>
              ✓ {isEditing ? 'As alterações serão encaminhadas para revisão institucional.' : 'Ao enviar, a pesquisa será encaminhada para aprovação institucional.'}
            </div>
            {submitError && <div style={{ fontSize: 13, color: '#dc2626', background: 'rgba(220,38,38,0.07)', borderRadius: 6, padding: '8px 12px' }}>{submitError}</div>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button onClick={() => step > 1 ? setStep(s => s - 1) : null} style={{ ...ws.btnSecondary, visibility: step === 1 ? 'hidden' : 'visible' }}>← Anterior</button>
          {step < 5
            ? (() => {
                const step3Blocked = step === 3 && (!aiDone || !form.simplified || form.simplified.trim().length < 20);
                return (
                  <button
                    onClick={() => step3Blocked ? null : setStep(s => s + 1)}
                    style={{ ...ws.btn, opacity: step3Blocked ? 0.4 : 1, cursor: step3Blocked ? 'not-allowed' : 'pointer' }}
                    title={step3Blocked ? 'Gere ou edite a versão simplificada antes de continuar.' : undefined}
                  >Próximo →</button>
                );
              })()
            : <button onClick={handleSubmit} style={ws.btn}>{isEditing ? '💾 Salvar e enviar para revisão' : '🚀 Enviar para Aprovação'}</button>
          }
        </div>
      </div>
    </div>
  );
}

const ws = {
  card: { background: '#ffffff', border: '1px solid rgba(0,60,180,0.1)', borderRadius: 14, padding: '28px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 2px 12px rgba(0,60,180,0.06)' },
  stepTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: '#0d1f3c' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 700, color: '#6b7fa3', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: { background: '#f7faff', border: '1px solid rgba(0,60,180,0.15)', borderRadius: 8, padding: '11px 14px', color: '#0d1f3c', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  btn: { background: 'linear-gradient(135deg,#3b8eff,#0040cc)', border: 'none', borderRadius: 8, padding: '12px 24px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  btnSecondary: { background: '#ffffff', border: '1px solid rgba(0,60,180,0.18)', borderRadius: 8, padding: '12px 24px', color: '#6b7fa3', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
};
