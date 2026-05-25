import { useState } from 'react';
import { useMobile } from './hooks/useMobile';
import { AuthScreen } from './components/Auth/AuthScreen';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileNav } from './components/Layout/MobileNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ResearchDetail } from './components/Dashboard/ResearchDetail';
import { NewResearch } from './components/Research/NewResearch';
import { MyResearch } from './components/Research/MyResearch';
import { Chat } from './components/Chat/Chat';
import { GovDashboard } from './components/Gov/GovDashboard';
import { Approvals } from './components/Gov/Approvals';
import { Connections } from './components/Gov/Connections';
import { MESSAGES } from './data';

export default function App() {
  const mobile = useMobile();
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState('dashboard');
  const [detail, setDetail] = useState(null);
  const [chatConv, setChatConv] = useState(null);
  const [messages, setMessages] = useState(MESSAGES);

  const handleLogin = (u) => {
    setUser(u);
    setNav(u.role === 'gov' || u.role === 'org' ? 'govdashboard' : 'dashboard');
  };

  const handleLogout = () => setUser(null);

  const handleDetail = (project) => {
    setDetail(project);
    setNav('detail');
  };

  const handleContact = (project) => {
    const existing = messages.find(m => m.projectId === project.id);
    if (existing) {
      setChatConv(existing);
    } else {
      const newConv = { id: Date.now(), projectId: project.id, orgName: 'Sua Organização', orgAvatar: 'VO', messages: [] };
      setMessages(ms => [...ms, newConv]);
      setChatConv(newConv);
    }
    setNav('chat');
  };

  const navigate = (n) => { setNav(n); setDetail(null); setChatConv(null); };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (nav === 'govdashboard') return <GovDashboard onApprovals={() => setNav('approvals')} onDetail={handleDetail} />;
    if (nav === 'approvals')    return <Approvals />;
    if (nav === 'connections')  return <Connections />;
    if (nav === 'detail' && detail) return <ResearchDetail project={detail} onBack={() => setNav('dashboard')} onContact={handleContact} />;
    if (nav === 'new')          return <NewResearch onDone={() => navigate('myresearch')} />;
    if (nav === 'chat')         return <Chat initialConversation={chatConv} />;
    if (nav === 'myresearch')   return <MyResearch onNew={() => navigate('new')} onDetail={handleDetail} />;
    return <Dashboard onDetail={handleDetail} />;
  };

  const activeNav = nav === 'detail' ? 'dashboard' : nav;

  return (
    <div style={{
      display: 'flex', width: '100%',
      height: mobile ? 'auto' : '100vh',
      minHeight: '100dvh',
      flexDirection: mobile ? 'column' : 'row',
      overflow: mobile ? 'auto' : 'hidden',
      animation: 'fadeIn 0.3s ease',
    }}>
      {!mobile && <Sidebar nav={activeNav} setNav={navigate} user={user} onLogout={handleLogout} />}
      <div style={{ flex: 1, minWidth: 0, overflow: mobile ? 'visible' : 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: mobile ? 64 : 0 }}>
        {renderContent()}
      </div>
      {mobile && <MobileNav nav={activeNav} setNav={navigate} user={user} onLogout={handleLogout} />}
    </div>
  );
}
