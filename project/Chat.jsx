// Chat.jsx — Mensagens internas (tema claro · Recife)

function Chat({ initialConversation }) {
  const mobile = window.useMobile();
  const [conversations, setConversations] = React.useState(window.HubData.MESSAGES);
  const [active, setActive] = React.useState(initialConversation || window.HubData.MESSAGES[0]);
  const [input, setInput] = React.useState('');
  const [notif, setNotif] = React.useState(null);
  const messagesEndRef = React.useRef(null);

  const activeConv = conversations.find(c => c.id === active?.id);
  const project = activeConv ? window.HubData.PROJECTS.find(p => p.id === activeConv.projectId) : null;

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { from: 'researcher', text: input, time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) };
    setConversations(cs => cs.map(c => c.id === active.id ? { ...c, messages: [...c.messages, newMsg] } : c));
    setInput('');
    setTimeout(() => {
      const replies = ['Perfeito! Vamos agendar para essa semana.','Ótimo, aguardamos mais detalhes.','Podemos marcar uma reunião para discutir a proposta?','Excelente iniciativa! Contamos com a parceria.'];
      const reply = { from: 'org', text: replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) };
      setConversations(cs => cs.map(c => c.id === active.id ? { ...c, messages: [...c.messages, reply] } : c));
      setNotif('Nova mensagem recebida!');
      setTimeout(() => setNotif(null), 3000);
    }, 1500);
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.offsetTop;
    }
  }, [activeConv?.messages?.length]);

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:'#f4f8ff',overflow:'hidden',position:'relative',width:'100%'}}>
      {/* Toast */}
      {notif && (
        <div style={{position:'absolute',top:16,right:16,zIndex:100,background:'rgba(5,150,105,0.1)',border:'1px solid rgba(5,150,105,0.3)',borderRadius:8,padding:'10px 16px',color:'#059669',fontSize:13,fontWeight:600,boxShadow:'0 4px 16px rgba(0,60,180,0.1)',display:'flex',alignItems:'center',gap:8}}>
          🔔 {notif}
        </div>
      )}

      {/* Header */}
      <div style={{background:'#ffffff',borderBottom:'1px solid rgba(0,60,180,0.1)',padding:'18px 24px'}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:800,color:'#0d1f3c'}}>Mensagens</h2>
        <p style={{margin:'3px 0 0',fontSize:12,color:'#6b7fa3'}}>{conversations.length} conversa{conversations.length!==1?'s':''} ativa{conversations.length!==1?'s':''}</p>
      </div>

      <div style={{flex:1,display:'flex',overflow:'hidden',flexDirection: mobile?'column':'row'}}>
        {/* Conversation list */}
        <div style={{width: mobile?'100%':270, maxHeight: mobile?220:undefined, flexShrink:0,borderRight: mobile?'none':'1px solid rgba(0,60,180,0.1)',borderBottom: mobile?'1px solid rgba(0,60,180,0.1)':'none',background:'#ffffff',overflow:'auto',display:'flex',flexDirection:'column'}}>
          {conversations.map(conv => {
            const proj = window.HubData.PROJECTS.find(p=>p.id===conv.projectId);
            const last = conv.messages[conv.messages.length-1];
            const isActive = active?.id === conv.id;
            return (
              <div key={conv.id} onClick={() => setActive(conv)}
                style={{padding:'14px 16px',borderBottom:'1px solid rgba(0,60,180,0.07)',cursor:'pointer',background: isActive ? 'rgba(0,96,224,0.07)' : '#ffffff',borderLeft: isActive ? '3px solid #0060e0' : '3px solid transparent',transition:'all 0.15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(0,96,224,0.1)',border:'2px solid rgba(0,96,224,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#0060e0',flexShrink:0}}>{conv.orgAvatar}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:'#0d1f3c',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{conv.orgName}</div>
                  </div>
                </div>
                <div style={{fontSize:11,color:'#6b7fa3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingLeft:44}}>{last?.text}</div>
                {proj && <div style={{fontSize:10,color:'#0060e0',marginTop:3,paddingLeft:44,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>📎 {proj.title}</div>}
              </div>
            );
          })}
          <div style={{padding:'14px 16px',marginTop:'auto',borderTop:'1px solid rgba(0,60,180,0.08)'}}>
            <div style={{fontSize:11,color:'#6b7fa3',textAlign:'center',lineHeight:1.5}}>Novas conversas são iniciadas pela página de detalhe da pesquisa</div>
          </div>
        </div>

        {/* Thread */}
        {activeConv ? (
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Thread header */}
            <div style={{padding:'14px 24px',borderBottom:'1px solid rgba(0,60,180,0.1)',background:'#ffffff',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(0,96,224,0.1)',border:'2px solid rgba(0,96,224,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#0060e0'}}>{activeConv.orgAvatar}</div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#0d1f3c'}}>{activeConv.orgName}</div>
                {project && <div style={{fontSize:11,color:'#6b7fa3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:400}}>📎 {project.title}</div>}
              </div>
              {project && (
                <div style={{marginLeft:'auto',background:'rgba(5,150,105,0.09)',border:'1px solid rgba(5,150,105,0.25)',borderRadius:6,padding:'4px 12px',fontSize:11,color:'#059669',fontWeight:600}}>
                  Projeto vinculado
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{flex:1,overflow:'auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:14,background:'#f4f8ff'}}>
              {activeConv.messages.map((msg,i) => {
                const isMe = msg.from === 'researcher';
                return (
                  <div key={i} style={{display:'flex',justifyContent: isMe ? 'flex-end' : 'flex-start',gap:8,alignItems:'flex-end'}}>
                    {!isMe && (
                      <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(0,96,224,0.1)',border:'1px solid rgba(0,96,224,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#0060e0',flexShrink:0}}>{activeConv.orgAvatar}</div>
                    )}
                    <div style={{maxWidth:'68%'}}>
                      <div style={{background: isMe ? 'linear-gradient(135deg,#3b8eff,#0040cc)' : '#ffffff', border: isMe ? 'none' : '1px solid rgba(0,60,180,0.1)', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding:'10px 14px', boxShadow: isMe ? '0 2px 8px rgba(0,64,204,0.25)' : '0 1px 4px rgba(0,60,180,0.07)'}}>
                        <p style={{margin:0,fontSize:13,color: isMe ? '#ffffff' : '#0d1f3c',lineHeight:1.6}}>{msg.text}</p>
                      </div>
                      <div style={{fontSize:10,color:'#6b7fa3',marginTop:3,textAlign: isMe ? 'right' : 'left'}}>{msg.time}</div>
                    </div>
                    {isMe && (
                      <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(5,150,105,0.12)',border:'1px solid rgba(5,150,105,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#059669',flexShrink:0}}>AL</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef}/>
            </div>

            {/* Input */}
            <div style={{padding:'14px 24px',borderTop:'1px solid rgba(0,60,180,0.1)',background:'#ffffff',display:'flex',gap:10,alignItems:'flex-end'}}>
              <textarea
                value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
                placeholder="Escreva sua mensagem... (Enter para enviar)"
                style={{flex:1,background:'#f7faff',border:'1px solid rgba(0,60,180,0.15)',borderRadius:10,padding:'11px 14px',color:'#0d1f3c',fontSize:13,outline:'none',fontFamily:'inherit',resize:'none',minHeight:44,maxHeight:120,lineHeight:1.5}}
                rows={1}
              />
              <button onClick={send} style={{background:'linear-gradient(135deg,#3b8eff,#0040cc)',border:'none',borderRadius:10,padding:'11px 16px',color:'#fff',fontSize:16,cursor:'pointer',flexShrink:0,height:44,display:'flex',alignItems:'center',justifyContent:'center'}}>➤</button>
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
            <div style={{fontSize:40}}>✉</div>
            <div style={{fontSize:15,fontWeight:600,color:'#0d1f3c'}}>Selecione uma conversa</div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Chat });
