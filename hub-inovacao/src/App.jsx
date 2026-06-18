import { useState } from 'react';
import { useMobile } from './hooks/useMobile';
import { useAuth } from './contexts/AuthContext';
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

export default function App() {
  const mobile = useMobile();
  const { profile, loading, signOut } = useAuth();

  const [nav, setNav]               = useState('dashboard');
  const [detail, setDetail]         = useState(null);
  const [detailOrigin, setDetailOrigin] = useState('dashboard');
  const [chatConvId, setChatConvId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Aguarda a sessão carregar
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f8ff' }}>
        <div style={{ textAlign: 'center', color: '#6b7fa3' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
          <div style={{ fontSize: 14 }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <AuthScreen />;
  }

  const handleDetail = (project, origin = 'dashboard') => {
    setDetail(project);
    setDetailOrigin(origin);
    setNav('detail');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setNav('edit');
  };

  const handleContact = (convId) => {
    setChatConvId(convId);
    setNav('chat');
  };

  const navigate = (n) => {
    setNav(n);
    setDetail(null);
    if (n !== 'chat') setChatConvId(null);
  };

  const defaultNav = profile.role === 'gov' || profile.role === 'org' ? 'govdashboard' : 'dashboard';

  const renderContent = () => {
    const n = nav;

    if (n === 'govdashboard') return <GovDashboard onApprovals={() => navigate('approvals')} onDetail={handleDetail} onExplore={() => navigate('dashboard')} filterInstitution={profile.role === 'org' ? profile.institution : null} />;
    if (n === 'approvals' && profile.role === 'org') return <Approvals onDetail={(p) => handleDetail(p, 'approvals')} filterInstitution={profile.institution} />;
    if (n === 'connections')  return <Connections onChat={handleContact} />;
    if (n === 'detail' && detail) return <ResearchDetail project={detail} onBack={() => navigate(detailOrigin)} onContact={handleContact} />;
    if (n === 'new')          return <NewResearch onDone={() => navigate('myresearch')} />;
    if (n === 'edit')         return <NewResearch project={editingProject} onDone={() => navigate('myresearch')} />;
    if (n === 'chat')         return <Chat initialConvId={chatConvId} />;
    if (n === 'myresearch')   return <MyResearch onNew={() => navigate('new')} onDetail={handleDetail} onEdit={handleEdit} />;
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
      {!mobile && (
        <Sidebar
          nav={activeNav}
          setNav={navigate}
          user={profile}
          onLogout={signOut}
        />
      )}
      <div style={{ flex: 1, minWidth: 0, overflow: mobile ? 'visible' : 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: mobile ? 64 : 0 }}>
        {renderContent()}
      </div>
      {mobile && (
        <MobileNav
          nav={activeNav}
          setNav={navigate}
          user={profile}
          onLogout={signOut}
        />
      )}
    </div>
  );
}
