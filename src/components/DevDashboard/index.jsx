import DesenvolvedorAdmin from '../Admin/Desenvolvedor';
import './devdashboard.css';

const DevDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('devToken');
    localStorage.removeItem('devUser');
    window.location.href = '/?dev=true';
  };

  return (
    <div className="dev-dashboard-container">
      <div className="dev-dashboard-header">
        <div className="dev-dashboard-header-left">
          <h1>👨‍💻 Área do Desenvolvedor</h1>
          <p>Ferramentas e informações para manutenção do sistema</p>
        </div>
        <button className="dev-logout-btn" onClick={handleLogout}>
          🚪 Sair
        </button>
      </div>
      <div className="dev-dashboard-content">
        <DesenvolvedorAdmin />
      </div>
    </div>
  );
};

export default DevDashboard;
