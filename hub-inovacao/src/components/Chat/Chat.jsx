import { useState, useRef, useEffect } from 'react';
import { useMobile } from '../../hooks/useMobile';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../contexts/AuthContext';

export function Chat({ initialConvId }) {
  const mobile = useMobile();
  const { profile } = useAuth();
  const { conversations, loading: convsLoading } = useConversations();

  const [activeId, setActiveId] = useState(initialConvId || null);
  const [input, setInput]       = useState('');
  const [notif, setNotif]       = useState(null);
  const messagesEndRef           = useRef(null);

  // Define a conversa ativa assim que as conversas carregarem
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (initialConvId) setActiveId(initialConvId);
  }, [initialConvId]);

  const activeConv = conversations.find(c => c.id === activeId);

  const { messages, sendMessage } = useMessages(activeId);

  // Scroll automático
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  // Toast de nova mensagem de outro usuário
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.sender_id !== profile?.id) {
      setNotif('Nova mensagem recebida!');
      const t = setTimeout(() => setNotif(null), 3000);
      return () => clearTimeout(t);
    }
  }, [messages.length]);

  const getOtherParty = (conv) => {
    if (!conv || !profile) return { name: '...', avatar: '?' };
    if (profile.id === conv.org_user_id) return conv.researcher;
    return conv.org_user;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f4f8ff', overflow: 'hidden', position: 'relative', width: '100%' }}>
      {notif && (
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100, background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: 8, padding: '10px 16px', color: '#059669', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,60,180,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          🔔 {notif}
        </div>
      )}

      <div style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,60,180,0.1)', padding: '18px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0d1f3c' }}>Mensagens</h2>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6b7fa3' }}>
          {convsLoading ? 'Carregando...' : `${conversations.length} conversa${conversations.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: mobile ? 'column' : 'row' }}>
        {/* Lista de conversas */}
        <div style={{ width: mobile ? '100%' : 270, maxHeight: mobile ? 220 : undefined, flexShrink: 0, borderRight: mobile ? 'none' : '1px solid rgba(0,60,180,0.1)', borderBottom: mobile ? '1px solid rgba(0,60,180,0.1)' : 'none', background: '#ffffff', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {conversations.map(conv => {
            const other = getOtherParty(conv);
            const isActive = activeId === conv.id;
            return (
              <div key={conv.id} onClick={() => setActiveId(conv.id)}
                style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,60,180,0.07)', cursor: 'pointer', background: isActive ? 'rgba(0,96,224,0.07)' : '#ffffff', borderLeft: isActive ? '3px solid #0060e0' : '3px solid transparent', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,96,224,0.1)', border: '2px solid rgba(0,96,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0060e0', flexShrink: 0 }}>{other?.avatar || '?'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{other?.name || '...'}</div>
                  </div>
                </div>
                {conv.project && <div style={{ fontSize: 10, color: '#0060e0', marginTop: 3, paddingLeft: 44, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {conv.project.title}</div>}
              </div>
            );
          })}
          <div style={{ padding: '14px 16px', marginTop: 'auto', borderTop: '1px solid rgba(0,60,180,0.08)' }}>
            <div style={{ fontSize: 11, color: '#6b7fa3', textAlign: 'center', lineHeight: 1.5 }}>Novas conversas são iniciadas pela página de detalhe da pesquisa</div>
          </div>
        </div>

        {/* Thread */}
        {activeConv ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,60,180,0.1)', background: '#ffffff', display: 'flex', alignItems: 'center', gap: 12 }}>
              {(() => {
                const other = getOtherParty(activeConv);
                return (
                  <>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,96,224,0.1)', border: '2px solid rgba(0,96,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0060e0' }}>{other?.avatar || '?'}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1f3c' }}>{other?.name || '...'}</div>
                      {activeConv.project && <div style={{ fontSize: 11, color: '#6b7fa3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>📎 {activeConv.project.title}</div>}
                    </div>
                    {activeConv.project && (
                      <div style={{ marginLeft: 'auto', background: 'rgba(5,150,105,0.09)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#059669', fontWeight: 600 }}>
                        Projeto vinculado
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#f4f8ff' }}>
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === profile?.id;
                const avatar = msg.sender?.avatar || (isMe ? profile?.avatar : '?');
                return (
                  <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                    {!isMe && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,96,224,0.1)', border: '1px solid rgba(0,96,224,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0060e0', flexShrink: 0 }}>{avatar}</div>
                    )}
                    <div style={{ maxWidth: '68%' }}>
                      <div style={{ background: isMe ? 'linear-gradient(135deg,#3b8eff,#0040cc)' : '#ffffff', border: isMe ? 'none' : '1px solid rgba(0,60,180,0.1)', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '10px 14px', boxShadow: isMe ? '0 2px 8px rgba(0,64,204,0.25)' : '0 1px 4px rgba(0,60,180,0.07)' }}>
                        <p style={{ margin: 0, fontSize: 13, color: isMe ? '#ffffff' : '#0d1f3c', lineHeight: 1.6 }}>{msg.text}</p>
                      </div>
                      <div style={{ fontSize: 10, color: '#6b7fa3', marginTop: 3, textAlign: isMe ? 'right' : 'left' }}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {isMe && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#059669', flexShrink: 0 }}>{profile?.avatar}</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(0,60,180,0.1)', background: '#ffffff', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Escreva sua mensagem... (Enter para enviar)"
                style={{ flex: 1, background: '#f7faff', border: '1px solid rgba(0,60,180,0.15)', borderRadius: 10, padding: '11px 14px', color: '#0d1f3c', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', minHeight: 44, maxHeight: 120, lineHeight: 1.5 }}
                rows={1}
              />
              <button onClick={send} style={{ background: 'linear-gradient(135deg,#3b8eff,#0040cc)', border: 'none', borderRadius: 10, padding: '11px 16px', color: '#fff', fontSize: 16, cursor: 'pointer', flexShrink: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 40 }}>✉</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0d1f3c' }}>Selecione uma conversa</div>
          </div>
        )}
      </div>
    </div>
  );
}
