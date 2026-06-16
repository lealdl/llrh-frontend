import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getLogo } from '../../services/api';
import './header.css';

const Header = ({ onLogout }) => {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => {
    return new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  useEffect(() => {
    const carregarLogo = async () => {
      try {
        const result = await getLogo();
        if (result.success && result.url) {
          setLogoUrl(result.url);
        }
      } catch (error) {
        console.error('Erro ao carregar logo:', error);
      }
    };
    carregarLogo();
    
    const handleLogoUploaded = () => {
      carregarLogo();
    };
    
    window.addEventListener('logoUploaded', handleLogoUploaded);
    return () => window.removeEventListener('logoUploaded', handleLogoUploaded);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setDrawerAberto(false);
  };

  const handleAdminClick = () => {
    window.location.href = '/?admin=true';
    setDrawerAberto(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    setDrawerAberto(false);
  };

  useEffect(() => {
    if (drawerAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerAberto]);

  const drawerContent = (
    <>
      <div className={`drawer-overlay ${drawerAberto ? 'active' : ''}`} onClick={() => setDrawerAberto(false)} />
      <div className={`drawer ${drawerAberto ? 'active' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            {logoUrl ? <img src={logoUrl} alt="LLRH Logo" className="drawer-logo-img" /> : <div className="drawer-logo-circle">LLRH</div>}
            <div className="drawer-logo-text"><h3>LLRH</h3><p>ATRAÇÃO DE TALENTOS</p></div>
          </div>
          <button className="drawer-close" onClick={() => setDrawerAberto(false)}>×</button>
        </div>
        
        <nav className="drawer-nav">
          {!isAdmin && (
            <>
              <a onClick={() => scrollToSection('home')}>🏠 Início</a>
              <a onClick={() => scrollToSection('sobre')}>📖 Sobre</a>
              <a onClick={() => scrollToSection('historia')}>📜 Nossa História</a>
              <a onClick={() => scrollToSection('servicos')}>⚙️ Serviços</a>
              <a onClick={() => scrollToSection('vagas')}>💼 Vagas</a>
              <a onClick={() => scrollToSection('contato')}>📞 Contato</a>
              <a className="drawer-admin-link" onClick={handleAdminClick}>🔒 Área Admin</a>
            </>
          )}
          {isAdmin && (
            <>
              <div className="drawer-section-title">ADMINISTRAÇÃO</div>
              <a onClick={() => window.location.reload()}>📊 Dashboard</a>
              <a className="drawer-logout-link" onClick={handleLogout}>🚪 Sair</a>
            </>
          )}
        </nav>
        
        <div className="drawer-footer">
          <p>© 2024 LLRH</p>
          <p>Todos os direitos reservados</p>
        </div>
      </div>
    </>
  );

  console.log('🔍 Header renderizado - isAdmin:', isAdmin);

  return (
    <>
      <header className={`header ${isAdmin ? 'admin-header' : ''}`}>
        <div className="header-container">
          <div className="logo" onClick={() => !isAdmin && scrollToSection('home')}>
            {logoUrl ? <img src={logoUrl} alt="Logo" className="logo-img" /> : <div className="logo-circle">LLRH</div>}
            <span className="logo-text">{isAdmin ? 'Painel Administrativo' : 'LLRH - Atração de Talentos'}</span>
          </div>
          
          <button 
            className="hamburger-btn-custom"
            onClick={() => setDrawerAberto(!drawerAberto)}
          >
            <span className="hamburger-line-custom"></span>
            <span className="hamburger-line-custom"></span>
            <span className="hamburger-line-custom"></span>
          </button>
        </div>
      </header>

      {createPortal(drawerContent, document.body)}
    </>
  );
};

export default Header;
